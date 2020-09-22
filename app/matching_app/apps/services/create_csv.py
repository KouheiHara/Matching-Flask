from io import StringIO
import csv


def get_rid_of_new_line(text: str):
    return text.replace("\r\n", " ").replace("\n", " ").replace("\r", " ")


def create_csv(array):
    """array(list):ファイルの書き込むリスト
        [{'id':1, 'name':'name1'},{'id':2, 'name':'name2'},...,{'filename':'filename1'}]
    """
    f = None
    try:
        f = StringIO()
        writer = csv.writer(
            f, quotechar='"', quoting=csv.QUOTE_ALL)
        keys = []
        rows = []
        for dic in array:
            _keys = dic.keys()
            if keys == _keys:
                rows.append(list(map(str, list(dic.values()))))
            else:
                if len(rows) != 0:
                    rows.append([""])
                rows.append(list(_keys))
                rows.append(list(map(str, list(dic.values()))))
                keys = _keys
        writer.writerows(rows)
        data = f.getvalue()
        data = data.encode("utf-8")
    except Exception as e:
        raise e
    finally:
        if f:
            f.close()
    return data
