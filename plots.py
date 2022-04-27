from data import get_master_dict
import matplotlib.pyplot as plt
import numpy as np

d = get_master_dict()

course_counts = {}
for v in d.values():
    chars = [c for c in v["department"] if c in "0123456789"]
    dep_no = "".join(chars)

    if course_counts.get(dep_no):
        course_counts[dep_no] += 1
    else:
        course_counts[dep_no] = 1

labels = np.array(list(course_counts.keys()))
y = np.array(list(course_counts.values()))

idx = np.argsort(y)[::-1]
labels = labels[idx]
y = y[idx]

x = np.arange(len(y))

fig, ax = plt.subplots(figsize=(10, 5))

plt.bar(x, y)
plt.xticks(ticks=np.arange(len(y)), labels=labels)
plt.xlabel("Department")
plt.ylabel("# of courses")
plt.title("Number of courses per department")
plt.show()


department_grades = {}
for v in d.values():
    chars = [c for c in v["department"] if c in "0123456789"]
    dep_no = "".join(chars)

    if v.get("avg") is not None:
        if department_grades.get(dep_no):
            department_grades[dep_no].append(v["avg"])
        else:
            department_grades[dep_no] = [v["avg"]]

labels = np.array(list(department_grades.keys()))

y = np.array([np.mean(v) for v in department_grades.values()])
idx = np.argsort(y)[::-1]
labels = labels[idx]
y = y[idx]

x = np.arange(len(y))

fig, ax = plt.subplots(figsize=(10, 5))

plt.bar(x, y)
plt.xticks(ticks=np.arange(len(y)), labels=labels)
plt.xlabel("Department")
plt.ylabel("Average grade")
plt.title("Average grade in courses by department")
plt.show()
