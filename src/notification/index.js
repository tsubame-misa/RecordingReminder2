import { Plugins, LocalNotification } from "@capacitor/core";
import { useIonViewWillEnter } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useStorage } from "@ionic/react-hooks/storage";

const { LocalNotifications } = Plugins;

class Notifications {
  async removeAllListeners() {
    try {
      console.log("hello rm!");
      LocalNotifications.removeAllListeners();
    } catch (error) {
      console.error(error);
    }
  }

  async stopLocalPush() {
    try {
      LocalNotifications.getPending().then(
        (res) => {
          console.log(res, "elo");
          LocalNotifications.cancel(res);
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  async check() {
    try {
      LocalNotifications.getPending().then(
        (res) => {
          console.log(res, "check");
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /*async schedule(data) {
    try {
      // Request/ check permissions
      //if (!(await LocalNotifications.requestPermission()).granted) return;

      /*
      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);
      */

  /*const notifs = await LocalNotifications.schedule({
        notifications: data.map(({ id, min }) => {
          console.log("hei", id, min);
          return {
            //ここの文面をどうするのか
            title: "録画しましたか？",
            body: "",
            //変えたほうが良い？
            id: id,
            sound: "normail",
            //minute秒後に通知
            schedule: { at: new Date(Date.now() + 1000 * min) },
          };
        }),
      });

      console.log("scheduled notifications", notifs);

      return await notifs;
    } catch (error) {
      console.error(error);
    }
  }*/
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
            schedule: { at: new Date(Date.now() + 1000 * 5) },
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications();
