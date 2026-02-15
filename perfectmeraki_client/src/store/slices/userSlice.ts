import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

const initialState: UserState = {
  name: "",
  email: "",
  role: "",
  id: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role || "";
      state.id = action.payload.id;
    },
    clearUser(state) {
      state.name = "";
      state.email = "";
      state.role = "";
      state.id = undefined;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
export type { UserState };
