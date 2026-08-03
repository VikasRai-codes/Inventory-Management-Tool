import express from "express";
import path from "path";
const app = express();

const paths = path.join(path.resolve(),'src','Views' )
console.log(paths)