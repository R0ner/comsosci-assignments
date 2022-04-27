# -*- coding: utf8 -*-
import json
import time
import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

course_dict = {}

with open("coursenumbers.txt", "r") as f:
    courses = f.read()

courses = set(courses.split(","))

for i, course_num in enumerate(courses):
    try:
        course = {}

        print(f"Course: {course_num} ({i + 1}/{len(courses)})")
        url = f"https://kurser.dtu.dk/course/{course_num}"

        html = requests.get(url, cookies={
            'ASP.NET_SessionId': os.environ["ASP_NET_SESSIONID"],
            r"{DTUCoursesPublicLanguage}": "en-GB"}).content

        soup = BeautifulSoup(html, features="lxml")
        contents = soup.find("div", {"id": "pagecontents"})
        left_bar, right_bar = contents.find_all(
            "div", {"class": "col-md-6 col-sm-12 col-xs-12"})

        # process right bar
        separators = right_bar.find_all("div", {"class": "bar"})
        bottom_layers_removed = str(right_bar).split(str(separators[3]))[0]
        outer_divs_removed = bottom_layers_removed.split('<div class="box">')[
            1]
        right_bar_text = BeautifulSoup(
            outer_divs_removed, features="lxml").get_text(separator=" ")

        course["description"] = right_bar_text

        # process left bar
        table_rows = left_bar.find_all("tr")
        for row in table_rows:
            cols = row.find_all("td")

            if len(cols) != 2:
                continue

            label, value = cols[0].text, cols[1].text

            # not pretty, but robust to missing rows etc.
            if label == "Point( ECTS )":
                course["ects"] = value
            if label == "Course type":
                course["type"] = value
            if label == "Recommended prerequisites":
                course["prerequisites"] = value
            if label == "Responsible":
                course["responsible"] = value
            if label == "Course co-responsible":
                course["co-responsible"] = value
            if label == "Department":
                course["department"] = value
            if label == "Evaluation":
                course["evaluation"] = value
            if label == "Location":
                course["location"] = value
            if label == "Language of instruction":
                course["language"] = value

        header = contents.find("div", {"class": "col-xs-8"})
        course["name"] = " ".join(header.text.split(" ")[1:])

        # write course to overall course dict
        course_dict[course_num] = course

    except KeyboardInterrupt:
        exit()
    except Exception as e:
        print("ERROR:", str(e))
        print("Skipping " + str(course_num))

with open('course_page_dict.json', 'w') as outfile:
    json.dump(course_dict, outfile)
