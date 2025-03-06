import {
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    doc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../firebaseConfig";
  import { auth } from "../firebaseConfig";
  
  export const fetchPosts = async (lastVisible: any = null) => {
    try {
      let q;
      if (lastVisible) {
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10));
      }
  
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { posts, lastVisible: snapshot.docs[snapshot.docs.length - 1] || null };
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts.");
    }
  };
  
  export const addPost = async (imageUrl: string, caption: string) => {
    if (!auth.currentUser) throw new Error("User not authenticated.");
  
    try {
      const post = {
        imageUrl,
        caption,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      };
  
      await addDoc(collection(db, "posts"), post);
      console.log("Post added successfully.");
    } catch (error) {
      console.error("Error adding post:", error);
      throw new Error("Failed to add post.");
    }
  };
  
  export const fetchFavorites = async (userId: string) => {
    try {
      const favoritesRef = collection(db, "favorites");
      const q = query(favoritesRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  };
  
  export const addToFavorites = async (postId: string, imageUrl: string, caption: string) => {
    if (!auth.currentUser) return;
  
    try {
      const favoritesRef = collection(db, "favorites");
      const q = query(favoritesRef, where("postId", "==", postId), where("userId", "==", auth.currentUser.uid));
      const existing = await getDocs(q);
  
      if (!existing.empty) {
        console.log("Already favorited.");
        return;
      }
  
      await addDoc(favoritesRef, {
        postId,
        userId: auth.currentUser.uid,
        imageUrl,
        caption,
        createdAt: new Date(),
      });
  
      console.log("Added to favorites.");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };
  
  export const removeFromFavorites = async (postId: string) => {
    if (!auth.currentUser) return;
  
    try {
      const favoritesRef = collection(db, "favorites");
      const q = query(favoritesRef, where("postId", "==", postId), where("userId", "==", auth.currentUser.uid));
      const existing = await getDocs(q);
  
      if (!existing.empty) {
        await deleteDoc(doc(db, "favorites", existing.docs[0].id));
        console.log("Removed from favorites.");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };
  