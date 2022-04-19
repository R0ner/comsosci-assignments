# -*- coding: utf8 -*-
import json
import time

import requests
import re
import pickle
import pprint
from bs4 import BeautifulSoup
import json
import sys
import datetime
import traceback

chrome_options = Options()
chrome_options.add_argument("--headless")

course_dict = {}
driver = webdriver.Chrome(options=chrome_options)

with open("coursenumbers.txt", "r") as f:
    courses = f.read()

for i, course_num in enumerate(courses.split(",")):
    try:
        course = {}

        print("Course: "+course_num)
        url = f"https://kurser.dtu.dk/course/{course_num}"
        print(url)
        html = requests.get(url, cookies={
            'ASP.NET_SessionId': "",
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
            outer_divs_removed, features="lxml").text

        course["description"] = right_bar_text

        # process left bar
        table_rows = left_bar.find_all("tr")
        print(len(table_rows))
        for row in table_rows:
            cols = row.find_all("td")

            if len(cols) != 2:
                continue

            label, value = cols[0].text, cols[1].text

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

        # write course to overall course dict
        course_dict[course_num] = course

    except KeyboardInterrupt:
        exit()
    except Exception as e:
        print("ERROR:", str(e))
        print("Skipping " + str(course_num))

with open('course_page_dict.json', 'w') as outfile:
    json.dump(course_dict, outfile)
