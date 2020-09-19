from matching_app import app
from matching_app.apps.models.db import *
from matching_app.apps.services.morphological_analysis import *
from matching_app.apps.controllers.tweet import TweetManager


class KeywordManager(object):
    def _delete_cloud_keyword(self, morphological_text_id: str) -> None:
        with session_scope() as session:
            session.query(
                    CloudWord
                ).filter(
                    CloudWord.morphological_text_id==morphological_text_id
                ).delete()
            session.commit()

    @staticmethod
    def get_combined_text(user_id: str) -> str:
        c_t = ""
        tweets = TweetManager.get_tweets(user_id=user_id)
        for tweet in tweets:
            c_t += tweet.text+"\n"
        return c_t

    def _calc_cloud_word(self, combined_text: str) -> tuple:
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

    @staticmethod
    def get_cloud_words(morphological_text_id: int) -> list:
        cloud_words = None
        with session_scope() as session:
            cloud_words = session.query(
                    CloudWord
                ).filter(
                    CloudWord.morphological_text_id==morphological_text_id
                ).all()
        return cloud_words

    def _save_morphological_test(self, user_id: str, combined_text: str, total: int=None) -> MorphologicalText:
        morphological_text = None
        with session_scope() as session:
            morphological_text = session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id==user_id
                ).first()
            if not total:
                if morphological_text:
                    morphological_text.combined_text = combined_text
                    morphological_text.calculated = 0
                    morphological_text.received = 0
                    morphological_text.sum = 1
                else:
                    morphological_text = MorphologicalText(
                        twitter_user_id = user_id,
                        combined_text = combined_text,
                        calculated = 0,
                        received = 0,
                        sum = 1
                    )
                    session.add(morphological_text)
            else:
                morphological_text.sum = total
                morphological_text.calculated = 1
                morphological_text.received = 1
            session.commit()
            session.refresh(morphological_text)
        return morphological_text

    @staticmethod
    def get_morphological_text(user_id: str) -> MorphologicalText:
        morphological_text = None
        with session_scope() as session:
            morphological_text = session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id==user_id
                ).first()
        return morphological_text

    def _save_cloud_words(self, cloudwords: list) -> None:
        with session_scope() as session:
            session.bulk_save_objects(cloudwords)
            session.commit()

    def _get_combined_text_and_calc_keyword_cloud(self, user_id: str) -> tuple:
        combined_text = self.get_combined_text(user_id)
        total, words = self._calc_cloud_word(combined_text)
        return (
            combined_text,
            total,
            words
        )

    def get_and_save_keyword_cloud(self, user_id: str) -> list:
        combined_text, total, words = self._get_combined_text_and_calc_keyword_cloud(user_id)
        morph = self._save_morphological_test(user_id, combined_text)
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
        self._save_cloud_words(save_datas)
        self._save_morphological_test(user_id, combined_text, total=total)
        return {
            "total": total,
            "words": words
        }
    
    @staticmethod
    def get_cloud_words_from_user_id(user_id: str) -> list:
        morphological_text = KeywordManager.get_morphological_text(user_id)
        cloud_words = KeywordManager.get_cloud_words(morphological_text.id)
        return cloud_words