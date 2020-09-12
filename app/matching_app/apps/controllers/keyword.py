from matching_app import app
from matching_app.apps.models.db import *
from matching_app.apps.services.morphological_analysis import *


class KeywordManager(object):
    def _delete_cloud_keyword(self, morphological_text_id:str) -> None:
        with session_scope() as session:
            session.query(
                    CloudWord
                ).filter(
                    CloudWord.morphological_text_id==morphological_text_id
                ).delete()

    def _get_combined_text(self, user_id:str) -> str:
        c_t = ""
        with session_scope() as session:
            tweets = session.query(
                    Tweet.text
                ).filter(
                    Tweet.twitter_user_id==user_id 
                ).all()
            for tweet in tweets:
                c_t += tweet.text+"\n"
        return c_t

    def _calc_cloud_word(self, combined_text) -> tuple:
        rets =  tokenizer_mecab(combined_text)
        rets_set = list(set(rets))
        counters = []
        for val in rets_set:
            count = rets.count(val)
            counters.append(count)
        total = sum(counters)
        uses = []
        for index in range(app.config.get("CLOUD_NUMS")):
            max_count = max(counters)
            max_index = counters.index(max_count)
            if max_count == -1:
                break
            else:
                uses.append({
                    "text":rets_set[max_index],
                    "value": max_count
                })
                counters[max_index] = -1
        return (
            total,
            uses
        )

    def get_keyword_cloud(self, user_id:str) -> list:
        combined_text = self._get_combined_text(user_id)
        morph = None
        with session_scope() as session:
            morph = session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id==user_id
                ).first()
            if morph:
                morph.combined_text = combined_text
                morph.calculated = 0
                morph.received = 0
                morph.sum = 1
            else:
                morph = MorphologicalText(
                    twitter_user_id = user_id,
                    combined_text = combined_text,
                    calculated = 0,
                    received = 0,
                    sum = 1
                )
                session.add(morph)
            session.commit()
            session.refresh(morph)
        
        total, words = self._calc_cloud_word(combined_text)
        self._delete_cloud_keyword(morph.id)

        save_datas = []
        for word in words:
            save_datas.append(
                CloudWord(
                    morphological_text_id=morph.id,
                    word=word["text"],
                    count=word["value"]
                )
            )

        with session_scope() as session:
            morph = session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id==user_id
                ).first()
            morph.sum = total
            morph.calculated = 1
            morph.received = 1
            session.bulk_save_objects(save_datas)
            session.commit()

        return {
            "total": total,
            "words": words
        }
