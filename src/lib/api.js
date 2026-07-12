import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://campus-7o6l.onrender.com";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// ---------- Request interceptor ----------
api.interceptors.request.use((config) => {
  // Attach auth token
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // If mirror mode is active, inject university_id query parameter
  const mirrorActive = localStorage.getItem("mirrorMode") === "true";
  const mirrorUniversityId = localStorage.getItem("mirrorUniversityId");
  if (mirrorActive && mirrorUniversityId) {
    // Add university_id to the request's query parameters
    config.params = {
      ...config.params,
      university_id: mirrorUniversityId,
    };
  }

  return config;
});

// ---------- Response interceptor ----------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ========== Image helpers ==========
const compressImage = (base64Str, maxWidth = 800, quality = 0.7) => {
  if (base64Str.startsWith("http")) return Promise.resolve(base64Str);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/webp", quality));
      } catch (e) {
        resolve(canvas.toDataURL("image/jpeg", quality));
      }
    };
    img.onerror = reject;
    img.src = base64Str;
  });
};

const compressImageArray = async (images) => {
  if (!images || !images.length) return [];
  return Promise.all(images.map(img => compressImage(img)));
};

// ========== Auth ==========
export async function googleAuth(id_token, email, name, picture, ref = null, university_id = null) {
  const { data } = await api.post("/auth/google", {
    id_token, email, name, picture, ref: ref || null, university_id
  });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logout() {
  try { const { data } = await api.post("/auth/logout"); return data; }
  finally { localStorage.removeItem("token"); }
}

export async function signupEmail(email, password, name, university_id = null) {
  const { data } = await api.post("/auth/signup", { email, password, name, university_id });
  return data;
}

export async function loginEmail(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}

export async function verifyEmail(token) {
  const { data } = await api.post("/auth/verify-email", { token });
  return data;
}

export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
}

// ========== University ==========
export async function setUniversity(universityId) {
  const { data } = await api.post("/university/set", { university_id: universityId });
  return data;
}

// ========== Location ==========
export async function updateLocation(latitude, longitude, accuracy = null) {
  const { data } = await api.post("/location/update", { latitude, longitude, accuracy });
  return data;
}

export async function getLocationStatus() {
  const { data } = await api.get("/location/status");
  return data;
}

export async function ipLocationFallback() {
  const { data } = await api.get("/location/ip-fallback");
  return data;
}

export async function requestAndUpdateGPS() {
  if (!navigator.geolocation) throw new Error("Geolocation not supported");
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try { resolve(await updateLocation(latitude, longitude, accuracy)); }
        catch (error) { reject(error); }
      },
      (error) => reject(new Error("Unable to get location")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// ========== Profile ==========
export async function setupProfile(payload) {
  const compressedPayload = { ...payload };
  if (payload.profile_image) {
    compressedPayload.profile_image = await compressImage(payload.profile_image);
  }
  if (payload.gallery_images) {
    compressedPayload.gallery_images = await compressImageArray(payload.gallery_images);
  }
  const { data } = await api.post("/profile/setup", compressedPayload);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/profile");
  return data;
}

export async function updateProfile(payload) {
  const cleanPayload = { ...payload };
  delete cleanPayload.country;
  delete cleanPayload.city;
  delete cleanPayload.latitude;
  delete cleanPayload.longitude;
  if (cleanPayload.profile_image) {
    cleanPayload.profile_image = await compressImage(cleanPayload.profile_image);
  }
  if (cleanPayload.gallery_images) {
    cleanPayload.gallery_images = await compressImageArray(cleanPayload.gallery_images);
  }
  const { data } = await api.put("/profile", cleanPayload);
  return data;
}