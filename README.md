# Link-Up

Hey! Welcome to Link-Up. This is a real-time chat application I built to experiment with WebSockets, modern UI design, and single-page applications.

It works a lot like WhatsApp or typical messaging platforms. You can create an account, log in, find other registered users, and send messages back and forth instantly. I spent some time really polishing the Tailwind UI (including a custom dark/light mode toggle in the settings) so it feels premium to use.

## Tech Stack I Used
- **Laravel 12** (Core framework & Backend API)
- **React 18 & Inertia.js** (Frontend UI without full-page reloads)
- **Tailwind CSS 3** (Custom color palettes and glassmorphism styling)
- **Laravel Reverb** (WebSockets for the real-time chat events)
- **SQLite** (Super simple local database)

## How to run it locally

If you have PHP (8.3+) and Composer on your computer, getting this running is super straightforward. Just open up your terminal and follow these steps:

```bash
# 1. Pull down all backend and frontend dependencies
composer install
npm install

# 2. Set up the environment file
cp .env.example .env
php artisan key:generate

# 3. Create the database tables
php artisan migrate

# 4. Compile the React code
npm run build

# 5. Start the WebSocket server (keep this running in one terminal!)
php artisan reverb:start

# 6. Start the actual web server (run this in a second terminal)
php artisan serve
```

Once that's all done, just head over to `http://localhost:8000` in your browser. 

*(Pro-tip: If you want to chat with someone and you're the only user on the app, you can quickly spin up some dummy users by running `php artisan tinker` and using `App\Models\User::factory()->count(2)->create()`!)*

## Deploying to Vercel

If you want to host this in the cloud, I set up a custom configuration (`vercel.json`) so that you can deploy it directly to Vercel using the `vercel-php` runtime. 

To deploy:
1. Make sure you have Node installed.
2. Run `npx vercel` in this folder.
3. Follow the CLI login prompts and just accept all the default link settings.
4. Go to your new project in the Vercel Dashboard and make sure to populate your `.env` variables (you'll need to hook up an external database like PlanetScale or Supabase, and configure your Reverb keys).

Have fun playing around with it!
