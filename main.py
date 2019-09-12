import eel

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
    s = ''
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

eel.init('web')
eel.start("main.html")



'''
#Found window size option: https://stackoverflow.com/a/56430385
if eel.chrome.get_instance_path() is not None:
    eel.start('main.html', size=(650, 612), options={'port': 0})
else:
    eel.start('main.html', size=(650, 612), options={
              'port': 0, 'mode': 'user selection'})
'''