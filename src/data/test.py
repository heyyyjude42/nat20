import json
import time

d = json.loads(open('./srd.json').read())
target = "dwarf".lower()

def search(target, d):
    result = []
    for i in d.keys():
        if i.lower().find(target) > -1:
            print "found"
            result.append([d[i]])
        else:
            if type(d[i]) == type({}):
                next = search(target, d[i])
                if len(next) > 0:
                    result.append(next)
    return result


tic = time.time()
print search(target, d)
toc = time.time()

print str(toc-tic) + 'seconds'
