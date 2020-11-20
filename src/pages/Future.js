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
} from "@ionic/react";
import { add, ellipsisHorizontal, trash } from "ionicons/icons";
import { useAuth0 } from "@auth0/auth0-react";

export const useFetch_get = (url) => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState([]);
  useIonViewWillEnter(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://rere",
          scope: "read:posts",
        });
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // body: JSON.stringify(token),
        });
        setData(await response.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  if (data != []) {
    return data;
  }
};

export const convertDate = (input) => {
  if (input === null) {
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

const Loading = () => {
  return <p>Loading...</p>;
};

const Future = ({ history }) => {
  //const [data, setData] = useState([]);
  let data = useFetch_get(
    `${process.env.REACT_APP_API_ENDPOINT}/get_user_list`
  );
  //console.log(d);
  //setData(d);
  // let history = useHistory();

  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  /*useIonViewWillEnter(() => {
    window
      .fetch(`${process.env.REACT_APP_API_ENDPOINT}/get_user_list`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);*/

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
        }
      )
      .then((response) => response.json())
      .then((new_data) => {
        //setData(data);
        data = new_data;
      });
  };

  if (data === []) {
    return <Loading />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Future</IonTitle>
        </IonToolbar>
        <IonButton
          color="light"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </IonButton>
      </IonHeader>

      <IonContent fullscreen>
        {data
          .filter((d) => {
            return CmpTime(d.date) > 0;
          })
          .map((d, id) => {
            return (
              <IonItem key={id}>
                <IonCheckbox slot="start" checked={d.check} />
                {d.channel} &emsp;
                {convertDate(d.date)} &emsp;
                {d.name}
                <IonButton
                  slot="end"
                  fill="none"
                  color="dark"
                  onClick={() => {
                    history.push(`/detail/${d.id}/from_future`);
                  }}
                >
                  <IonIcon icon={ellipsisHorizontal}></IonIcon>
                </IonButton>
                <IonButton
                  slot="end"
                  fill="none"
                  color="dark"
                  onClick={() => {
                    delItem(d.id);
                  }}
                >
                  <IonIcon icon={trash}></IonIcon>
                </IonButton>
              </IonItem>
            );
          })}

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
