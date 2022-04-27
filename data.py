import json


def get_master_dict():
    with open("course_page_dict.json", "r") as jsonfile:
        page_info = json.load(jsonfile)

    with open("evaluation_and_grades.json", "r") as jsonfile:
        eval_and_grades = json.load(jsonfile)

    with open("percentiles_and_grade_avg.json", "r") as jsonfile:
        percentiles = json.load(jsonfile)

    common_keys = set(page_info.keys()) & set(
        eval_and_grades.keys()) & set(percentiles.keys())

    master_dict = {}
    for key in common_keys:
        master_dict[key] = {**eval_and_grades[key],
                            **percentiles[key], **page_info[key]}

    return master_dict


if __name__ == "__main__":
    d = get_master_dict()
    print(len(d))
    print(d["01005"].keys())
