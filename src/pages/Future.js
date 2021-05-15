import React, { useState /*useEffect */ } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  useIonViewWillEnter,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonLoading,
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
//import { useStorage } from "@ionic/react-hooks/storage";
import { request_user_tv_list, request_delete } from "../auth_fetch/index";
import AX from "./img/AX.png";
import CX from "./img/CX.png";
import E from "./img/E.png";
import MX from "./img/MX.png";
import NHK from "./img/NHK.png";
import NX from "./img/NX.png";
import TBS from "./img/TBS.jpg";
import TX from "./img/TX.png";
import "./styles.css";
//import notifications from "../notification/index";

export const convertIcon = (input) => {
  if (input === "NHK総合") {
    return NHK;
  }
  if (input === "Eテレ") {
    return E;
  }
  if (input === "日テレ") {
    return NX;
  }
  if (input === "テレビ朝日") {
    return AX;
  }
  if (input === "TBS") {
    return TBS;
  }
  if (input === "テレビ東京") {
    return TX;
  }
  if (input === "フジテレビ") {
    return CX;
  }
  if (input === "東京MX") {
    return MX;
  }
};

export const convertDate = (input) => {
  if (input === null) {
    return "";
  }

  const d = new Date(input);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const date = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const createdDay =
    year + "/" + month + "/" + date + "/" + hour + ":" + minute;
  return createdDay;
};

export const CmpTime = (item) => {
  const current = new Date();
  const date = Date.parse(item);
  if (date < current) {
    return -1;
  } else {
    return 1;
  }
};

const Future = ({ history }) => {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const date_data = [];

  /* const TASKS_STORAGE = "tasks";
  const { get set, remove  } = useStorage();
  const [tasks2, setTask2] = useState([{ id: "19990909", min: 1 }]);*/

  const { getAccessTokenSilently } = useAuth0();

  useIonViewWillEnter(async () => {
    const d = await request_user_tv_list(getAccessTokenSilently);
    setData(d);
    /*const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
    const data = JSON.parse(localStorage.getItem("noti"));
    console.log(data);*/
  }, []);
  /*useEffect(() => {
    const getTasks = async () => {
      const tasksString = await get(TASKS_STORAGE);
      const taskData = tasksString ? JSON.parse(tasksString) : [];
      setTask2(taskData);
    };
    getTasks();
    const data = JSON.parse(localStorage.getItem("noti"));
    console.log(data);
  }, [get]);*/

  if (!(data === [] || data === undefined)) {
    data.sort((a, b) => {
      const a_date = convertDate(a.date);
      const b_date = convertDate(b.date);
      if (a_date > b_date) {
        return 1;
      } else {
        return -1;
      }
    });

    for (let i = 0; i < data.length; i++) {
      const d = convertDate(data[i].date).slice(0, 10);
      if (!date_data.includes(d)) {
        date_data.push([d, 0]);
      }
    }
  }

  const delItem = (id, date) => {
    /*console.log(convertDate(date));
    console.log(tasks2);
    for (let item of tasks2) {
      console.log(
        convertDate(item.date).slice(0, 10),
        convertDate(date).slice(0, 10)
      );
      if (
        convertDate(item.date).slice(0, 10) === convertDate(date).slice(0, 10)
      ) {
        if (item.count > 1) {
          item.count -= 1;
          set(TASKS_STORAGE, JSON.stringify(tasks2));
          console.log(item.count);
        } else {
          console.log("rm!");
          item.rm = true;
          notifications.cancelPush(item.id);
          //const d2 = tasks2.filter((item) => item.rm !== true);
          /*remove(TASKS_STORAGE);
          setTask2(d2);
          set(TASKS_STORAGE, JSON.stringify(tasks2));
        }
        break;
      }
    }*/

    request_delete(
      `https://blooming-coast-85852.herokuapp.com/api/delete_user_program_list/${id}`,
      //`${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
      getAccessTokenSilently
    ).then((data) => {
      setData(data);
    });
  };

  const check = (date) => {
    for (let i = 0; i < date_data.length; i++) {
      if (date === date_data[i][0] && date_data[i][1] === 0) {
        date_data[i][1] = 1;
        return 1;
      }
      if (date <= date_data[i][0]) {
        return 0;
      }
    }
    return 0;
  };

  if (data === [] || data === undefined) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="new">
            <IonTitle>録画リスト</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              color="dark"
              onClick={() => {
                history.push("/add_program");
              }}
            >
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="new">
          <IonTitle>録画リスト</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            const date = convertDate(d.date);
            return (
              <div key={id}>
                {check(date.slice(0, 10)) === 1 ? (
                  <IonItemDivider>
                    <IonLabel>{date.slice(0, 10)}</IonLabel>
                  </IonItemDivider>
                ) : (
                  []
                )}
                <IonItemSliding key={id}>
                  <IonItem
                    _ngcontent-yfv-c79=""
                    onClick={() => {
                      history.push(`/detail/${d.id}/from_future`);
                    }}
                    detail="false"
                    target="_blank"
                    class="item md item-lines-full in-list ion-activatable ion-focusable item-label hydrated"
                  >
                    <img
                      className="icon_image"
                      src={convertIcon(d.channel)}
                      alt=""
                    ></img>
                    <IonLabel>
                      &emsp; {date.slice(11)} &emsp; {d.name}
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      color="danger"
                      expandable
                      onClick={() => {
                        delItem(d.id, d.date);
                      }}
                    >
                      delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              </div>
            );
          })}

        <IonLoading
          cssClass="my-custom-class"
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
          duration={1000}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="dark"
            onClick={() => {
              history.push("/add_program");
            }}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Future;
