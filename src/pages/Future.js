import React, { useState, useEffect } from "react";
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
  IonButton,
  useIonViewWillEnter,
  IonCheckbox,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonLoading,
} from "@ionic/react";
import { add, ellipsisHorizontal, trash } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetch_get } from "../auth_fetch/index";

export const convertDate = (input) => {
  if (input === null || input == undefined) {
    return "";
  }

  const dateList = input.split(/[-T:]/);
  const createdDay =
    dateList[0] +
    "/" +
    dateList[1] +
    "/" +
    dateList[2] +
    " " +
    dateList[3] +
    ":" +
    dateList[4];
  //console.log(createdDay);
  return createdDay;
};

export const CmpTime = (item) => {
  const current = new Date();
  const date0 = convertDate(item);
  const date = Date.parse(date0);
  if (date < current) {
    return -1;
  } else {
    return 1;
  }
};

export const useGetToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://rere",
          scope: "read:posts",
        });
        setData(await token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);
  return data;
};

const Future = ({ history }) => {
  /*let data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/get_user_list`
  );*/
  const token = useGetToken();
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_user_list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  //
  data.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  const delItem = (id) => {
    console.log("del", id);
    window
      .fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/delete_user_program_list/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        //console.log("henkou");
        //data = new_data;
      });
  };

  if (data === []) {
    //setShowLoading(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Future</IonTitle>
          <IonButton
            color="dark"
            slot="end"
            size="small"
            fill="outline"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Log out
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            return (
              /*<IonItemSliding key={id}>
                <IonItem>
                  <IonCheckbox slot="start" checked={d.check} />
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      history.push(`/detail/${d.id}/from_future`);
                    }}
                  >
                    <IonItem>
                      {d.channel} &emsp;
                      {convertDate(d.date)} &emsp;
                    </IonItem>
                    <IonItem> {d.name}</IonItem>
                  </IonButton>

                  <IonItemOptions side="end">
                    <IonItemOption
                      color="danger"
                      expandable
                      onClick={() => {
                        delItem(d.id);
                      }}
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItem>
                    </IonItemSliding>*/

              <IonItemSliding key={id}>
                <IonButton
                  fill="clear"
                  onClick={() => {
                    history.push(`/detail/${d.id}/from_future`);
                  }}
                >
                  <IonItem>
                    {" "}
                    {d.channel} &emsp;
                    {convertDate(d.date)} &emsp;
                    {d.name}
                  </IonItem>
                </IonButton>

                <IonItemOptions side="start">
                  <IonItemOption color="primary" expandable>
                    Edit
                  </IonItemOption>
                </IonItemOptions>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    expandable
                    onClick={() => {
                      delItem(d.id);
                    }}
                  >
                    Delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
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
