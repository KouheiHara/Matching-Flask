from matching_app import app  # noqa


def convert_query_to_dict_list(query, keys) -> list:
    data = []
    if len(query) > 0:
        for obj in query:
            dic = {}
            for key in keys:
                dic[key] = getattr(obj, key)
            data.append(dic)
    return data
