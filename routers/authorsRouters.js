import { Router } from "express";
import {
    createAuthors,
    getAuthors,
    getAuthorbyID,
    updateAuthors,
    deleteAuthors
} from "../controllers/authorsController.js";

const router = Router();

router.get("/", getAuthors);
router.post("/", createAuthors);
router.get("/:id", getAuthorbyID);
router.patch("/:id", updateAuthors);
router.delete("/:id", deleteAuthors);

export default router;