const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const {MongoClient} = require('mongodb');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO










//a month we marked have moved to next month so we should know the days of last month
function getDaysInMonth() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    return new Date(currentYear, currentMonth - 1, 0).getDate();
}

// the database have saved the date we made the food
function getFoodFreshnessTime(lday, lmonth, lyear, lhour, totalTime) {
    const hoursday = 24;
    const event = new Date();

    var day = event.getDate();
    var month = event.getMonth()+1;
    var year = event.getFullYear();
    var timeMin = event.getMinutes();
    var timeHour = event.getHours();
    //console.log(day +"-"+ lday);
   
    if (lday - day == 0 & lmonth == month & lyear == year) {
        //console.log("day " + totalTime - (timeHour - lhour));
        return totalTime - (timeHour - lhour);
    } else if ((day - lday) == 1 & lmonth == month & lyear == year) {

        return totalTime - (hoursday - lhour) - timeHour;
    } else if ((day - lday) == 2 & lmonth == month & lyear == year) {
        totalTime -= (hoursday - lhour);

        return (totalTime -  hoursday) - timeHour;
    } else {
        if (day - lday > 2 & lmonth == month & lyear == year) {
            let totalDays = ((day - lday)+1);
            let multiplyDays = (totalDays - 2) * hoursday;// the last day we made and current day equal 2
            totalTime -= multiplyDays;
            totalTime -= hoursday - lhour;// 24 hours less the time we made
            return totalTime - timeHour;// less current time
        } else if (lmonth != month & lyear == year) {
            let totalDays = (getDaysInMonth() - lday) + day+1//get days of month - day we made plus a day of current month
            let multiplyDays = (totalDays - 2) * hoursday;
            totalTime -= multiplyDays;
            totalTime -= (hoursday - lhour);// 24 hours less the time we made
            return totalTime - timeHour;// less current time
        }
        
        return -1;
    }


}

// maneger task shift
function getTaskInShift(){

    const event = new Date();
    var dayWeek = event.getDay();
    var timeMin = event.getMinutes();
    var timeHour = event.getHours();
    var taskMorning="";
     var taskEvening="";
     var day="";
     var flag="0";
//console.log("day:"+ day +"," +"hour:"+ timeHour+"min:"+ timeMin);

switch (dayWeek) {//new Date().getDay()
  case 0:
      if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
    taskMorning="סידור סחורה קוקה קולה ונקיון מדף מעל המכונת גלידה";
    taskEvening="השריית ג’וסרים וקנקני פלסטיק בכלור, ואחת לשבועיים פירוק ונקיון יסודי של מכונת סאמוי";
    day = "Sunday";
    
    break;
  case 1:
     if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
    taskMorning="סידור סחורה טמפו ונקיון יסודי אמבטיית קרח";
    taskEvening="נקיון מגרות מתחת למכונת סאמוי ושל הלימונדות ונקיון טעלת ניקוז ע״י אקונומיקה";
    day = "Monday";
    break;
  case 2:
      if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
    taskMorning="נקיון חיצוני יסודי מכונת סאמוי, מכונת גלידה, מכונת לימונדה וסביבתן";
    taskEvening="נקיון מגרות מתחת לקפה והקרח";
     day = "Tuesday";
    break;
  case 3:
    if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
      taskMorning="סידור סחורה קוקה קולה הזזת חבית בירה כולל דיספנסר, ופח בקבוקים, ונקיון יסודי של האיזור";
      taskEvening="השריית כוסות וצלחות קפה ותה בכלור, נקיון חיצוני מכונת קפה ונקיון פנימי מטחנת קפה";
      day = "Wednesday";
    break;
  case 4:
      if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
     taskMorning="סידור סחורה טמפו ונקיון יסודי אמבטיית קרח";
     taskEvening="נקיון מגרות מתחת לכיור ולמכונת גלידה ונקיון מקפיא ונקיון תעלת ניקוז עם אקונומיקה";
    day = "Thursday";
    break;
  case 5:
     if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flug="0";
      }else{//it evening           
        flag="1";
      }
    taskMorning="ניקוי מדף מעל הסאמוי וספירת כוסות המדף";
    taskEvening="נקיון יסודי של הכיור וסביבתו ונקיון דלת בר";
    day = "Friday";
    break;
  case 6:
      if(timeHour<17 ){//it is morning or afternon
        flag="0";
      
      }else if(timeHour>17 & timeHour<18 & timeMin<31){// it is afternoon    
        flag="0";
      }else{//it evening           
        flag="1";
      }
    taskMorning="נקיון מדף מעל מכונת קפה";
    taskEvening="נקיון מכונת קרח חיצונית והפשרה של המקפיא העליון";
    day = "Saturday";
   default:
    day = "someting went wrong";
   
}
return taskMorning+"-"+taskEvening+"-"+flag+"-"+day;
}







app.post("/", async (req, res)=>{

   // console.log( req.body.status);
    const status = { "a": "צריך להכין", "b": "יש","b1": "מהיום", "c": "חצי מכונה","c1":"לנקות מכונה","d":"עדכון שעה ותאריך","e":"מופשר","f":"צריך להפשיר","f1":"צריך למלא"};
     const status1 ={ "g":"קופסא","h":"שתי קופסאות","i":"יש וביקשתי שיכינו","i1":"אין וביקשתי שיכינו","j":"אין בכלל","k":"ריקה","l":"חצי","m":"מלאה","n":"חסר" };
  
    const d = new Date();
    const uri = "mongodb+srv://RemindToRenew:AcYnl0100HjkWqcY@websw.dfksw.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
  

    if (req.body.status || req.body.mynotes) {
        
        
        try {
            const database = client.db('RePreparation');
            const coll = database.collection('bar');

            if(req.body.mynotes){
                console.log(req.body.mynotes);
                const doc1 = await coll.findOne({ _id: "642ab54517ddcd723b4ff58a" });
        
                    let adate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    await coll.updateOne({ _id: "642ab54517ddcd723b4ff58a" }, { $set: { note:req.body.mynotes , date: adate  } }, { upsert: true });
            } else{


            const result = req.body.status.split(',');
            console.log(result[0],result[1]);


            if (result[0] !== status['b'] & result[0] !==status['d'] & result[0]!==status['b1']  & result[0].length>2) {// if dosent sent yes or updtae date and time
                console.log("0");
                await coll.updateOne({ _id: result[1] }, { $set: { status: result[0], making: "1" } }, { upsert: true });// making 1 need to make it

            } else if ((result[0] === status['b'] & result[0].length==2) || result[0]===status['b1'] || result[0]===status1['h'] || result[0]=== status['e'] 
                       || result[0]=== status['m']) {// if sent yes

                const doc1 = await coll.findOne({ _id: result[1] });

                if (doc1['making'] === "1") {
                    console.log("1");
                    await coll.updateOne({ _id: result[1] }, { $set: { status: result[0], making:"0" } }, { upsert: true });
                }


            } else if (result[0] === status['d']) {// if status is date and time you can update the date and time you made
                const doc2 = await coll.findOne({ _id: result[1] });
                if ((doc2['status'] === status['b'] || doc2['status'] === status['b1']) & doc2['making'] === "0") {
                    console.log("3");
                    let adate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                    await coll.updateOne({ _id: result[1] }, { $set: { time: d.getHours(), date: adate  } }, { upsert: true });
                }
            }
            
        }//else
         

        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }


   res.redirect("/");
});



app.get("/", async (req, res) => {
    
    
    const status = { "a": "צריך להכין", "b": "יש","b1": "מהיום", "c": "חצי מכונה","c1":"לנקות מכונה","d":"עדכון שעה ותאריך","e":"מופשר","f":"צריך להפשיר","f1":"צריך למלא"};
     const status1 ={ "g":"קופסא","h":"שתי קופסאות","i":"יש וביקשתי שיכינו","i1":"אין וביקשתי שיכינו","j":"אין בכלל","k":"ריקה","l":"חצי","m":"מלאה","n":"חסר" };

    const d = new Date();
   
    const dblist = [];
    const noteTime = [];
  
       // run().catch(console.dir);
    const uri = "mongodb+srv://RemindToRenew:AcYnl0100HjkWqcY@websw.dfksw.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri);



          

    try {
        const database = client.db('RePreparation');
        const coll = database.collection('bar');

        const cursor = coll.find();
        const results = await cursor.toArray();
        results.forEach(async (vl) => {

            const date = vl['date'].split('-');
            var time = getFoodFreshnessTime(Number(date[0]), Number(date[1]), Number(date[2]), vl['time'], vl['totalTime']);
            //console.log(time); 
            const doc = {
                "_id": vl['_id'], "name": vl['name'], "totaltime":
                    vl['totalTime'], "times": time, "date": vl['date'],
                "status": vl['status'], "making": vl['making'],"made":vl['made']
            };  
            
            
            
            dblist.push(doc);
            
        });
        const doc1 = await coll.findOne({ _id: "642ab54517ddcd723b4ff58a" });
       

       

       for (let i = 0; i < dblist.length; i++) {

           if (dblist[i]['times'] < 7 || dblist[i]['times']<0) {
                noteTime.push(1);
              
            }else{
               noteTime.push(0);  

            }
        }
        var theTask = getTaskInShift()
        theTask = theTask.split("-"); 
        
        res.render("counting", {TheTask:theTask, dbList: dblist,NoteTime:noteTime ,Status: status,Status1:status1,Msg:doc1['note']});

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
   
   

   
    
});


app.listen(process.env.PORT);
/*app.listen(3000, function() {
  console.log("Server started on port 3000");
});*/
