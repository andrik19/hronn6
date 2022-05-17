SQLQuery = """
SELECT 'rentals: %s --> %s' AS FD,
CASE WHEN COUNT(*)=0 THEN 'MAY HOLD'
ELSE 'does not hold' END AS VALIDITY
FROM (
    SELECT c.%s
    FROM rentals c
    GROUP BY c.%s
    HAVING COUNT(DISTINCT c.%s) > 1
) X;
"""

def PrintSQL(Att1, Att2):
    print(SQLQuery % (Att1, Att2, Att1, Att1, Att2));


R = ['pid','hid','pn','s','hs','hz','hc']
for i in range(len(R)):
    for j in range(len(R)): 
        if (i != j):
            PrintSQL(R[i], R[j])
