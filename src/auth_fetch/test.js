import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useIonViewWillEnter } from "@ionic/react";

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
