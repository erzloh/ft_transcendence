# satori

**ft_transcendence** is our final project of **École 42 (Lausanne)**. It is an arcade-like website, we called **satori**, that brings together a **Pong** game, a 2-player **Pac-Man** game, and a variety of additional features such as **3D graphics, an AI opponent, user authentication and game statistics**. Particular emphasis was placed on delivering a **high-quality user experience** through a **modern-looking polished aesthetic**, prioritizing **accessibility, multi-language support, and a fully responsive interface**.

![satori_home](GitHub/satori_home.gif)

## Features & Tech Stack

- **Modern Frontend**: A rich UI designed with **Bootstrap** and custom **CSS/SCSS**, providing a polished aesthetic.
- **Django Backend**: A powerful framework for handling server-side logic, user authentication, and API development.
- **PostgreSQL Database**: A secure and reliable relational database for managing user profiles, game stats, and history.
- **Authentication System**: User registration, login, profile management, and game history tracking.
- **Pong Game**: 
  - **1v1 Mode**: Compete with friends or against an AI.
  - **Tournaments**: Create tournaments to play with friemds.
  - **3D Graphics**: Enhanced visuals powered by **Three.js** for a modern gaming feel.
- **2-Player Pac-Man Game**:
  - **Character Selection**: Choose from different characters with unique abilities.
  - **Multiple Maps**: Navigate various challenging maps.
- **Responsive & Accessible Design**: Optimized UI for desktops, tablets, and mobile devices, with features like keyboard navigation and adjustable settings.
- **Multi-language Support**: Available in multiple languages to cater to global users.
- **Docker & Makefile**: Utilize Docker for containerized deployment and a Makefile for simplifying project launch and management.

## Installation & Setup

To run this project locally, follow these steps:

### Prerequisites
- Docker and Docker Compose installed

### Clone the Repository
```bash
git clone https://github.com/erzloh/ft_transcendence.git
cd ft_transcendence
```

### Configure the Environment
Create a `.env` file in the root directory and add the following environment variables:

```bash
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
DJANGO_SECRET_KEY=
```

Replace the values with your desired settings.

### Launch the Project
Simply run the following command in your terminal:

```bash
make
```
This command will use Docker Compose to build and launch the backend, frontend, and PostgreSQL services inside Docker containers. Make sure Docker is running on your machine before executing the make command.

Now, your application should be up and running on https://localhost 🎉!

## Screenshots
![satori_pong_2d](GitHub/satori_pong_2d.gif)

---

![satori_pong_3d](GitHub/satori_pong_3d.gif)

---

![satori_pacman](GitHub/satori_pacman.gif)

---

![satori_login](GitHub/satori_login.png)

---

![satori_profile](GitHub/satori_profile.png)

---

![satori_stats](GitHub/satori_stats.png)

## Contributors

This project was developed by a collaborative team of 5 developers at École 42:

- **[Eric Holzer]** - Frontend Developer & UI/UX Specialist
- **[Louis Bertholet]** - Backend Developer
- **[Sacha Da Silva]** - Game Developer (Pac-Man & Pong)
- **[Cyrill Gross]** - Game Developer (Pong) and 3D Specialist
- **[Ethan Bernard]** - AI Developer (Pong)