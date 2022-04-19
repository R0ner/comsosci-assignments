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
from fake_useragent import UserAgent
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")

course_dict = {}
driver = webdriver.Chrome(options=chrome_options)

with open("coursenumbers.txt", "r") as f:
    courses = f.read()

for i, course_num in enumerate(courses.split(",")):
    try:
        print("Course: "+course_num)
        url = f"https://kurser.dtu.dk/course/{course_num}"
        print(url)

        driver.get(url)
        time.sleep(1)
        soup = BeautifulSoup(driver.page_source)
        contents = soup.find("div", {"id": "pagecontents"})
        left_bar, right_bar = contents.find_all(
            "div", {"class": "col-md-6 col-sm-12 col-xs-12"})

        break
    except KeyboardInterrupt:
        break
    except Exception as e:
        print(str(e))
        print("Skipping " + str(course_num))

with open('course_page_dict.json', 'w') as outfile:
    json.dump(course_dict, outfile)
