import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice";
import blogSlice from "./blogSlice";
import commentReducer from "./commentSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import { comment } from "postcss";

// ===============================
// Root Reducer
// ===============================
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  blog: blogSlice,
  comment: commentReducer, // ✅ ADD COMMENT REDUCER
});

// ===============================
// Persist Config
// ===============================
const persistConfig = {
  key: "root",
  version: 1,
  storage,

  // 🔥 IMPORTANT: temporarily disable blog persist if issues
  blacklist: ["blog"], // remove later if you want persistence for blog
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===============================
// Store
// ===============================
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// ===============================
// Persistor
// ===============================
export const persistor = persistStore(store);

export default store;