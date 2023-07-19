import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Bookid } from "../Pages/Bookid";
import { Readbook } from "../Pages/Readbook";
import { Uploadbook } from "../Pages/Uploadbook";
import { PageNotFound } from "../Pages/PageNotFound";
import { Userprofile } from "../Pages/Userprofile";

export const Allroutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Readbook" element={<Readbook />} />
        <Route path="/Readbook/:bookid" element={<Bookid />} />
        <Route path="/Uploadbook" element={<Uploadbook />} />
        <Route path="/Userprofile" element={<Userprofile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};
