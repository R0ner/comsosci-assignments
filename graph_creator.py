import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
import seaborn as sb
import networkx as nx
import netwulf as wulf
import datetime as dt
import shifterator as sh
import nltk
import re
import random
import json
import community

from networkx.readwrite import json_graph
from collections.abc import Iterable
from collections import Counter
from scipy import stats
from tfidf import term_frequency, inverse_document_frequency, tf_idf
from typing import List

from data import get_master_dict


def tokenize(text: str) -> List[str]:
    """Tokenizer function. 
    The following is removed from the tokenized text:
    Symbols, stop words.
    """
    text = text.lower()
    text = re.sub('[^a-z]', ' ', text)
    tokens = nltk.word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words and len(word) > 1 and 'void' not in word]
   
    return tokens

courses = pd.DataFrame.from_dict(get_master_dict(), orient='index')

courses['ects'] = courses['ects'].str.replace(',', '.').astype(float)
courses['description'] = courses['description'].str.replace('\r\n', ' ')
courses['department'] = courses['department'].str.replace('\r\n', ' ')
courses['responsible'] = courses['responsible'].str.replace('\r\n', ' ')
courses['co-responsible'] = courses['co-responsible'].str.replace('\r\n', ' ')
courses['name'] = courses['name'].str.replace('\r\n', ' ')
courses['type'] = courses['type'].str.replace('Offered as a single course', '')
courses['department'] = courses.apply(lambda row: row['department'] if row['department'][0] != ' ' else row['department'][1:], axis=1)

# Stop words are removed from the tokenized text. We get the stop words here.
stop_words = set(nltk.corpus.stopwords.words('english'))
stop_words = stop_words.union(
    set(('versionsee', 'danish', 'general', 'course', 
         'learning', 'able', 'met', 'student', 'learning', 'objectives', 
         'content', 'dk', 'kurser', 'https', 'toolsapply', 'must', 'see', 
         'submit'))
)
stop_words = [re.sub('[^a-z_-]', '', stop_word) for stop_word in stop_words]

courses['tokens'] = courses.apply(lambda row: tokenize(row['name'] + ' ' + row['description']), axis=1)

n_tokens = courses['tokens'].apply(lambda x: len(x))

# Create a corpus wich is a dictionary of the tokenized texts
corpus = courses['tokens'][n_tokens > 30].to_dict()

# Get a lookup table for the idf of each term in the corpus.
idf_lookup = inverse_document_frequency(corpus)

course_topics = {}
course_topics_tf = {}
for course, document in corpus.items():
    tfidf, terms, tf = tf_idf(document, idf_lookup, return_tf=True)
    
    mean, sd = tfidf.mean(), tfidf.std()
    topic_indices = tfidf >= np.percentile(tfidf, 97.5)
    topics = terms[topic_indices]
    topics_tf = tf[topic_indices]
    
    if topics.size:
        course_topics[course] = topics
        course_topics_tf[course] = {topics[i]: topics_tf[i] for i in range(topics.size)}

adjacency_dict = {}

n_courses = len(course_topics)
for i, (course, topics) in enumerate(course_topics.items()):
    edges = {}

    topics_set = set(topics)
    for other_course, other_topics in course_topics.items():
        if course == other_course:
            continue

        common_topics = topics_set.intersection(other_topics)
        if len(common_topics) > 0:
            w = sum([course_topics_tf[course][topic] * course_topics_tf[other_course][topic] for topic in common_topics])

            edges[other_course] = {'weight': float(w)}

    adjacency_dict[course] = edges

G = nx.Graph(adjacency_dict)

degrees = list(dict(G.degree).values())
avg_degree = np.mean(degrees)

print(f'Summary of the course network:\n\nNumber of nodes:\t{G.number_of_nodes()}' + 
      f'\nNumber of edges:\t{G.number_of_edges()}\nAverage node degree:\t{avg_degree:.2f}')


partition = nx.algorithms.community.louvain_communities(G, resolution=1, threshold=1e-07, seed=1510)

cleaned_partition = []
other_community = set()
for community in partition:
    if len(community) > 5:
        cleaned_partition.append(community)
    else:
        other_community = other_community.union(community)

cleaned_partition.append(other_community)
partition = cleaned_partition

nodes, links = [], []
course_ids = {}
department_ids = {department: i for i, department in enumerate(courses['department'].unique())}
partition_ids = {course: i for i, community in enumerate(partition) for course in community}
partition_names = {}

for i, community in enumerate(partition):
    community_topic_counts = {}
    for course in community:
        for topic, tf in course_topics_tf[course].items():
            if topic not in community_topic_counts:
                community_topic_counts[topic] = tf
            else:
                community_topic_counts[topic] += tf
    topics, counts = np.array(list(community_topic_counts.keys())), np.array(list(community_topic_counts.values()))
    if topics.size:
        sorted_indices = np.argsort(counts)[::-1]
        topics_top5 = list(topics[sorted_indices[:5]])
    name = ', '.join(topics_top5[:-1]) + ' and ' + topics_top5[-1]
    name = name[0].upper() + name[1:]
    partition_names[i] = name

for index, (course, val) in enumerate(G.nodes(data=True)):
    course_ids[course] = index
    department_name = courses.loc[course, 'department']
    partition_id = partition_ids[course]
    weight = sum([attr['weight'] for source, target, attr in G.edges(course, data=True)])
    node = {
        'id': index,
        'name': course,
        'label': courses.loc[course, 'name'],
        'department_id': department_ids[department_name],
        'partition_id': partition_id,
        'department_name': department_name,
        'partition_name': partition_names[partition_id],
        'weight': weight
    }
    nodes.append(node)

for source, target, attr in G.edges(data=True):
    weight = attr['weight']
    words = list(set(course_topics[source]).intersection(course_topics[target]))
    link = {
        'source': course_ids[source],
        'target': course_ids[target],
        'weight': weight,
        'words': words
    }
    links.append(link)

n_departments = courses['department'].nunique()
n_communities = len(partition)

cm = plt.get_cmap('tab20b')

color_linspace = np.linspace(0, 1, num=n_departments)
department_cmap = {i: tuple((np.array(cm(color_linspace[i]))[:3] * 255).astype(int)) for i in range(n_departments)}
department_cmap = {i: "#{0:02x}{1:02x}{2:02x}".format(*rgb) for i, rgb in department_cmap.items()}

cm = plt.get_cmap('gist_rainbow')

color_linspace = np.linspace(0, 1, num=n_communities)
community_cmap = {i: tuple((np.array(cm(color_linspace[i]))[:3] * 255).astype(int)) for i in range(n_communities)}
community_cmap = {i: "#{0:02x}{1:02x}{2:02x}".format(*rgb) for i, rgb in community_cmap.items()}

graph_dict = {
    'nodes': nodes, 
    'links': links, 
    'department_cmap': department_cmap, 
    'community_cmap': community_cmap
}

with open('graph_dict.json', 'w') as outfile:
        json.dump(graph_dict, outfile, indent=8)


