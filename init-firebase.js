var firebaseConfig = {
    apiKey: "AIzaSyBi9QF7qZPxXxs1DbnAoXc9btRqGMIUgQw",
    authDomain: "web-push-db0da.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "web-push-db0da",
    //storageBucket: "project-id.appspot.com",
    //messagingSenderId: "870155324419",
   // appID: "1:870155324419:web:0e251e0b7334b513201236",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)


  var db = firebase.firestore();



const collection = db.collection("schedule")
const submitButton = document.getElementById("submit")
const datetimeform = document.getElementById("meeting-time")
const planname = document.getElementById("text")

const dialog = document.getElementById('dialog');
const yes = document.getElementById('yes');
const no = document.getElementById('no');
const cancel = document.getElementById('cancel');

let isDialog = false;
let events =[]
//フォームに現在時刻を表示
window.addEventListener('load', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('meeting-time').value = now.toISOString().slice(0, -1);
});
//イベントクリック時
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
      eventClick: function(info) {
          var eventObj = info.event;
          if (eventObj.url) {
              alert(
              'Clicked ' + eventObj.title + '.\n' +
              'Will open ' + eventObj.url + ' in a new tab'
              );
              window.open(eventObj.url);
              info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
          } else {
            addEventListener('click', function() {
              if(!isDialog) {
                dialog.style.display = 'block';
                isDialog = true;
             }
            })
             
            //「はい」がクリックされたら
            yes.addEventListener('click', function(){ console.log('yes') });
             
            //「いいえ」がクリックされたら
            no.addEventListener('click', function(){ console.log('no') });
             
            //「キャンセル」がクリックされたら
            cancel.addEventListener('click', function(){ dialog.style.display = 'none' })
            isDialog = false;
          }
      },
      headerToolbar: {
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          right: 'today ,prevYear,prev,next,nextYear'
      },
      locale: 'ja',
      initialDate: '2020-08-15',
      events: events
  });
  collection.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          const timedata = doc.data().meeting_time.toDate()
          const titlename = doc.data().plan_name
          const yyyy = timedata.getFullYear()
          const mm = ("00" + (timedata.getMonth()+1)).slice(-2)
          const dd = ("00" + timedata.getDate()).slice(-2)
          const startDate = `${yyyy}-${mm}-${dd}`
          const event = {
              title: titlename,
              start: new Date(startDate + 'T00:00:00')
          }
          calendar.addEvent(event)
      });
      calendar.render();
  });
});

//追加ボタンを押した時
submitButton.addEventListener("click", () => {
  
  //console.log(datetimeform.value)
  
  const datedata = new Date(datetimeform.value)
  //console.log(planname.value)


  const data = {
    meeting_time: datedata,
    plan_name:planname.value
  }
  collection.add(data)
    .then(res => {
        console.log(res)
    })
    .catch((error) => {
      console.error("Error adding document: ", error)
    })
    
}) 



