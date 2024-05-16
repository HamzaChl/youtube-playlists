import { NextFunction, Request, Response, response } from "express";

export async function requireLogin(request: Request, response: Response, next: NextFunction) {
    if (request.session.username) {
        next();
    } else {
        response.redirect("/login");
    };
};


export async function sendBack(request: Request, response: Response, next: NextFunction) {
    if (request.session.username) {
        response.redirect("/home");
    } else {
        next();
    };
};