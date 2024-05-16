import express, { Router } from 'express';
import { User } from '../types';
import { tryLogin } from '../database';
import { flashMiddleware } from '../middleware/flashMiddleware';
import { requireLogin, sendBack } from '../middleware/middleware';

export default function createRouter(): Router {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.redirect('login');
  });

  router.get('/login', sendBack, (req, res) => {
    res.render('login', {
      message: req.session?.message
    });
  });

  router.post('/login', sendBack, flashMiddleware, async (req, res) => {
    const attempt: User = req.body;
    const login: User | undefined = await tryLogin(attempt);
    if (login) {
      req.session.username = login.username;
      res.redirect('/home');
    } else {
      req.session.message = 'Username / password niet correct.';
      res.redirect('/login');
    }
  });

  router.get('/home', requireLogin, (req, res) => {
    res.render('index');
  });

  router.get('/create', requireLogin, (req, res) => {
    res.render('create');
  });

  
  router.get('/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session:', err);
        return res.redirect('/home'); // Rediriger vers home en cas d'erreur
      }
      console.log('Session destroyed');
      res.redirect('/login');
    });
  });


  return router;
}
