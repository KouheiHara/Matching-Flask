import MeCab
m_t = MeCab.Tagger('-Ochasen -d /usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd')

def tokenizer_mecab(text):
    text = m_t.parse(text)
    lines = text.strip().split("\n")
    ret = []
    for line in lines:
        if len(line) >= 4:
            if "名詞-固有名詞" in line.split("\t")[3]:
                ret.append(line.split("\t")[0])
    return ret
