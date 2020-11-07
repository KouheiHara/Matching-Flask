from matching_app import app  # noqa
from matching_app.apps.models.db import *  # noqa
from matching_app.apps.models.twitter import *  # noqa
from matching_app.apps.services.morphological_analysis import *  # noqa


class KeywordManager(object):
    def __init__(self, session):
        self.session = session
        self._checkpoint_morphological_text = None

    def get_tweets(self, user_id: str) -> list:
        tweets = self.session.query(
            Tweet.text
        ).filter(
            Tweet.twitter_user_id == user_id
        ).all()
        return tweets

    def _delete_cloud_keyword(self, morphological_text_id: str) -> None:
        self.session.query(
            CloudWord
        ).filter(
            CloudWord.morphological_text_id == morphological_text_id
        ).delete()

    def get_combined_text(self, user_id: str) -> str:
        c_t = ""
        tweets = self.get_tweets(user_id)
        for tweet in tweets:
            c_t += tweet.text+"\n"
        return c_t

    def _calc_cloud_word(self, combined_text: str) -> tuple:
        rets = tokenizer_mecab(combined_text)
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
                    "text": rets_set[max_index],
                    "value": max_count
                })
                counters[max_index] = -1
        return (
            total,
            uses
        )

    def get_cloud_words(self, morphological_text_id: int) -> list:
        cloud_words = self.session.query(
            CloudWord
        ).filter(
            CloudWord.morphological_text_id == morphological_text_id
        ).all()
        return cloud_words

    def _save_morphological_text(self, user_id: str, combined_text: str, total: int = None) -> MorphologicalText:
        morphological_text = self.session.query(
            MorphologicalText
        ).filter(
            MorphologicalText.twitter_user_id == user_id
        ).first()
        if not total:
            if morphological_text:
                self._checkpoint_morphological_text = {
                    "user_id": user_id,
                    "morphological_text": morphological_text
                }
                morphological_text.combined_text = combined_text
                morphological_text.calculated = 0
                morphological_text.received = 0
                morphological_text.sum = 1
            else:
                self._checkpoint_morphological_text = {
                    "user_id": user_id,
                    "morphological_text": None
                }
                morphological_text = MorphologicalText(
                    twitter_user_id=user_id,
                    combined_text=combined_text,
                    calculated=0,
                    received=0,
                    sum=1
                )
                self.session.add(morphological_text)
        else:
            morphological_text.sum = total
            morphological_text.calculated = 1
            morphological_text.received = 1
        return morphological_text

    def get_morphological_text(self, user_id: str) -> MorphologicalText:
        morphological_text = self.session.query(
            MorphologicalText
        ).filter(
            MorphologicalText.twitter_user_id == user_id
        ).first()
        return morphological_text

    def _save_cloud_words(self, cloudwords: list) -> None:
        self.session.bulk_save_objects(cloudwords)

    def _get_combined_text_and_calc_keyword_cloud(self, user_id: str) -> tuple:
        combined_text = self.get_combined_text(user_id)
        total, words = self._calc_cloud_word(combined_text)
        return (
            combined_text,
            total,
            words
        )

    def get_and_save_morphological_text(self, user_id: str) -> list:
        combined_text, total, words = \
            self._get_combined_text_and_calc_keyword_cloud(user_id)
        morph = self._save_morphological_text(user_id, combined_text)
        return {
            "total": total,
            "words": words
        }, {
            "combined_text": combined_text,
            "total": total,
            "words": words,
            "morphological_text": morph
        }

    def rollback_morphological_text(self):
        if self._checkpoint_morphological_text:
            user_id = self._checkpoint_morphological_text["user_id"]
            if self._checkpoint_morphological_text["morphological_text"]:
                morph = self._checkpoint_morphological_text["morphological_text"]
                morphological_text = self.session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id == user_id
                ).first()
                morphological_text.twitter_user_id = morph.twitter_user_id
                morphological_text.combined_text = morph.combined_text,
                morphological_text.calculated = morph.calculated
                morphological_text.received = morph.received
                morphological_text.sum = morph.sum
                session.add(morphological_text)
            else:
                self.session.query(
                    MorphologicalText
                ).filter(
                    MorphologicalText.twitter_user_id == user_id
                ).delete()

    def update_cloud_keyword(
            self,
            user_id: str,
            combined_text: str,
            morphological_id: int,
            words: list,
            total: int):
        self._delete_cloud_keyword(morphological_id)
        save_datas = []
        for word in words:
            save_datas.append(
                CloudWord(
                    morphological_text_id=morphological_id,
                    word=word["text"],
                    count=word["value"]
                )
            )
        self._save_cloud_words(save_datas)
        self._save_morphological_text(user_id, combined_text, total=total)

    def get_cloud_words_from_user_id(self, user_id: str) -> list:
        morphological_text = self.get_morphological_text(user_id)
        cloud_words = self.get_cloud_words(morphological_text.id)
        return cloud_words
