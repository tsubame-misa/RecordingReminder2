import { Plugins } from "@capacitor/core";
//import { notifications } from "ionicons/icons";

const { LocalNotifications } = Plugins;

class Notifications {
  async removeAllListeners() {
    try {
      //console.log("hello rm!");
      LocalNotifications.removeAllListeners();
    } catch (error) {
      console.error(error);
    }
  }

  async stopLocalPush() {
    try {
      LocalNotifications.getPending().then(
        (res) => {
          //console.log(res, "elo");
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

  /*async cancelPush(id) {
    try {
      LocalNotifications.getPending().then(
        (res) => {
          console.log(res, "cancel", id);
          const d = [
            {
              notifications: { id: 20210525 },
            },
          ];
          LocalNotifications.cancel(d);
          /*let idx = -1;
          for (let i = 0; i < res.notifications.length; i++) {
            console.log(res.notifications[i], id);
            if (res.notifications[i].id === id) {
              idx = i;
              break;
            }
          }
          console.log(idx, res.notifications[idx]);
          const d = [
            {
              notifications: { id: "20210528" },
            },
          ];
          LocalNotifications.cancel(d);
          /*if (idx !== -1) {
            LocalNotifications.cancel(res.notifications[idx]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }*/

  async check() {
    try {
      LocalNotifications.getPending().then(
        (res) => {
          //console.log(res, "check");
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
  async schedule(item) {
    //console.log(item, item.id);
    try {
      // Request/ check permissions
      if (!(await LocalNotifications.requestPermission()).granted) return;

      // Clear old notifications in prep for refresh (OPTIONAL)
      /*const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0)
        await LocalNotifications.cancel(pending);*/

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "録画しましたか？",
            body: "",
            id: item.id, //変えたほうが良い？
            //minute秒後に通知
            sound: "normail",
            schedule: { at: new Date(Date.now() + 1000 * item.min) },
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Notifications();
