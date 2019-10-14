import sqlite3, getpass, requests, lxml.html
from datetime import datetime
from bs4 import BeautifulSoup

#Gets the current season for use in creating a table for the current semester
#Credit to https://stackoverflow.com/questions/16139306/determine-season-given-timestamp-in-python-using-datetime/28686747#28686747
#I edited the code to make the dates for each season line up with the start dates for each semester instead of solstices and equinoxes
def getSeason(d):
    y = d.year
    seasons = {"Summer":(datetime(y,5,15), datetime(y,8,16)),
           "Fall":(datetime(y,8,17), datetime(y,12,18)),
           "Spring":(datetime(y,1,17), datetime(y,5,14))}
    for season,(season_start, season_end) in seasons.items():
        if d>=season_start and d<= season_end:
            return season
    else:
        return 'Winter'

def getCRN(courseName):
    for s in courseName.split("-"):
        if len(s.strip()) == 5:
            return s.strip()
    return "NULL"

def classFind(semester):
    #The value being returned
    courseData = []

    #Starts up a session and gets the value of the semester from the current date
    s = requests.session()
    url = "https://sis.ccsnh.edu/PROD/bwckschd.p_disp_dyn_sched"
    r = s.get(url)
    soup = BeautifulSoup(r.content, "html.parser")
    val = str(soup.find("option", text=semester)).replace('<option value="', "").split('"')[0]

    #This payload is for selecting the semester you are looking for
    payload = {
        "p_term": val,
        "p_calling_proc": "bwckschd.p_disp_dyn_sched"
        }

    #A simple POST request
    res = s.post("https://sis.ccsnh.edu/PROD/bwckgens.p_proc_term_date", data=payload)

    #Gets the new URL
    url = "https://sis.ccsnh.edu/PROD/bwckgens.p_proc_term_date"
    r = s.get(url)

    #This payload is every parameter needed to submit the POST request to get the list of classes
    payload2 = {
        "term_in": val,
        "sel_subj": ["dummy", "%"],
        "sel_day": "dummy",
        "sel_schd": "dummy",
        "sel_insm": "dummy",
        "sel_camp": ["dummy", "MCC"],
        "sel_levl": "dummy",
        "sel_sess": ["dummy", "%"],
        "sel_instr": ["dummy", "%"],
        "sel_ptrm": ["dummy", "%"],
        "sel_attr": ["dummy", "%"],
        "sel_crse": "",
        "sel_title": "",
        "sel_from_cred": "",
        "sel_to_cred": "",
        "begin_hh": "0",
        "begin_mi": "0",
        "begin_ap": "a",
        "end_hh": "0",
        "end_mi": "0",
        "end_ap": "a"
    }

    #This gets EVERY course during the semester for MCC (only MCC)
    res = s.post("https://sis.ccsnh.edu/PROD/bwckschd.p_get_crse_unsec", data=payload2)

    #Finds all table rows on the page
    #Unfortunately, course names and their data are separate table rows
    for tr in  BeautifulSoup(res.text, "html.parser").find_all("tr"):
        r = []
        #Finds the course name in the first table row
        for courseName in tr.find_all("th", class_="ddtitle"):
            course = courseName.find("a").text
            #Gets the CRN from the course name
            crn = int(getCRN(course))
        #This information will be found in the row after the header row
        for table in tr.find_all("table", class_="datadisplaytable"):
            #Finds rows in the table below the "main table"
            for tr_sub in table.find_all("tr"):
                #Make sure table's row isn't empty
                if len(tr_sub.find_all("td", class_="dddefault")) > 0:
                    #The room information is always in column 4. Unfortunately, this information has no "id" attribute (which would have made it easier to find)
                    #The room information is stripped of whitespace
                    r.append(tr_sub.find_all("td", class_="dddefault")[3].text.strip())
                #If there is no cell data, skip
                else:
                    pass
        #My method of making sure data isn't overwritten between loops
        #Only writes to courseData if there is room data
        if len(r) != 0:
            c = {
                "CourseName": course,
                "CRN": crn,
                "Rooms": r
            }
            courseData.append(c)
    
    #Comprised of many dictionaries
    return courseData

#Inserts course data into the database
def insertData(semester):
    semesterHypenated = semester.replace(" ", "-")
    conn = sqlite3.connect("courses.db")
    c = conn.cursor()

    #Creates the table with the name of the semester
    c.execute(f"create table if not exists '{semesterHypenated}' ('CourseName' varchar(255), 'CRN' int, 'Rooms' varchar(255))")
    #Gets data from SIS
    data = classFind(semester)
    
    #For loop for inserting data
    for course in data:
        #This for loop is for if there is more than one room associated with a particular CRN
        for room in course["Rooms"]:
            #Inserts data into database
            c.execute(f""" insert into '{semesterHypenated}' values (?, ?, ?) """, (course["CourseName"], course["CRN"], room))

    #Commits changes to the database
    conn.commit()

#Searches for a room number attached to the provided CRN
def search(crn, semester):
    #This variable is only used for the name of the table
    semesterHypenated = semester.replace(" ", "-")
    conn = sqlite3.connect("courses.db")
    c = conn.cursor()

    #Searches for the room number using the CRN within SQLite
    sql = f""" select Rooms from '{semesterHypenated}' where CRN is '{crn}' """

    c.execute(sql)
    r = c.fetchall()

    return r