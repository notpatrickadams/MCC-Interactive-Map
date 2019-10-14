import eel, scrapedb
from datetime import datetime

numList = []

@eel.expose
def listadd(num):
    numList.append(num)

@eel.expose
def listpop():
    if numList is None or len(numList) == 0:
        pass
    else:
        numList.pop()

@eel.expose
def listclear():
    numList.clear()

@eel.expose
def numtostring():
    s = ""
    if numList is None or len(numList) == 0:
        return "CRN / Room #"
    if len(numList) > 5:
        for i in range(0, len(numList)):
            if len(numList) == 5:
                break
            numList.pop()
    for item in numList:
        s += str(item)

    return s

#Get return from JS, then print to Python console when this function is run in JS from submit button
@eel.expose
def printreturn():
    print(eel.radiochoice()())

@eel.expose
def crntoroom(crn):
    d = datetime.today()
    return scrapedb.search(crn, f"{scrapedb.getSeason(d)}-{d.year}")

eel.init("web")
eel.start("main.html")