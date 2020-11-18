import { Plugins, LocalNotification } from "@capacitor/core";
import { useIonViewWillEnter } from "@ionic/react";
import React, { useState, useEffect } from "react";
const { LocalNotifications } = Plugins;

class Notifications {
  /*  showMes = () => {
    const [data, setData] = useState([]);
    useIonViewWillEnter(() => {
      if ("data" in localStorage) {
        setData(JSON.parse(localStorage.getItem("data")));
        console.log(data);
      }
    });
    return 1;
  };*/

  async schedule(minute) {
    try {
      // Request/ check permissions
      if (!(await LocalNotifications.requestPermission()).granted) return;

      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "録画しましたか？",
            body: "",
            id: 1, //変えたほうが良い？
            //minute秒後に通知
            sound: "normail",
            schedule: { at: new Date(Date.now() + 1000 * minute) },
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications();
