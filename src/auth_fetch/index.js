export const request = async (url, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_user_tv_list = async (getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });
    console.log(token);
    const response = await fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/get_user_list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_delete = async (url, getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const request_put = async (url, getAccessTokenSilently, item) => {
  try {
    const token = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    });
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    console.log(response);
    //return await response;
  } catch (e) {
    console.error(e);
  }
};
