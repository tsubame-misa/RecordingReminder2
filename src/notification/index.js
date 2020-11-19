import { Plugins, LocalNotification } from "@capacitor/core";
import { useIonViewWillEnter } from "@ionic/react";
import React, { useState, useEffect } from "react";
const { LocalNotifications } = Plugins;

class Notifications {
  async schedule(minute) {
    try {
      // Request/ check permissions
      if (!(await LocalNotifications.requestPermission()).granted) return;

      /*
      // Clear old notifications in prep for refresh (OPTIONAL)
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);
      */

      await LocalNotifications.schedule({
        notifications: [
          {
            //ここの文面をどうするのか
            title: "録画しましたか？",
            body: "",
            //変えたほうが良い？
            id: 1,
            sound: "normail",
            //minute秒後に通知
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
