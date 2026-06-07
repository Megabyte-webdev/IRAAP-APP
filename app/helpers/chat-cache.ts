export const appendMessage = (old: any, message: any) => {
  if (!old?.pages?.length) return old;

  const pages = [...old.pages];
  const lastPage = pages[pages.length - 1];

  pages[pages.length - 1] = {
    ...lastPage,
    data: [...lastPage.data, message],
  };

  return {
    ...old,
    pages,
  };
};

export const replacePendingMessage = (old: any, payload: any) => {
  if (!old?.pages) return old;

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((m: any) =>
        m.id === payload.clientId || m.clientId === payload.clientId
          ? {
              ...payload,
              sender: m.sender,
            }
          : m,
      ),
    })),
  };
};
