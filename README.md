# Modern Portfolio Website

This is a modern, animated, and aesthetically beautiful portfolio website template. It features smooth animations, interactive elements, and a responsive design that looks great on all devices.

## Features

- Custom cursor animations
- Smooth scrolling
- Typed text effect
- Interactive skill progress bars
- Project filtering
- Responsive design
- Contact form with validation
- Modern UI with beautiful animations

## Setup Instructions

1. Replace placeholder images in the `img` folder with your own images:
   - `profile-placeholder.jpg` - Your profile picture for the hero section
   - `about-placeholder.jpg` - Your image for the about section
   - `project-placeholder-1.jpg` to `project-placeholder-4.jpg` - Images for your projects

2. Update your personal information:
   - Change "Your Name" to your actual name
   - Update the typed text strings in `js/main.js` to match your skills
   - Update contact information (email, phone, location)
   - Add links to your social media profiles
   - Update the project information with your actual projects

3. Customize the colors:
   - You can change the color scheme by modifying the CSS variables in the `:root` section of `css/style.css`

## Image Requirements

- Hero profile image: Recommended size 500x500px
- About image: Recommended size 600x800px
- Project thumbnails: Recommended size 600x400px

## Dependencies

This project uses the following libraries:
- [GSAP](https://greensock.com/gsap/) for animations
- [Typed.js](https://github.com/mattboldt/typed.js/) for the typing effect
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for the Poppins font

## Browser Support

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization Tips

1. To change the primary color scheme, edit these variables in `css/style.css`:
   ```css
   :root {
       --primary-color: #5e3bee;
       --secondary-color: #7e54f4;
       --hover-color: #4e2bd2;
   }
   ```

2. To add more skills, copy and paste a skill item in the HTML and update the icon, title, and percentage:
   ```html
   <div class="skill-item" data-aos="fade-up">
       <div class="skill-icon">
           <i class="fab fa-react"></i>
       </div>
       <h4>React</h4>
       <div class="skill-progress">
           <div class="progress-bar" data-percent="75"></div>
       </div>
   </div>
   ```

3. To add more projects, copy and paste a project item in the HTML:
   ```html
   <div class="project-item" data-category="web">
       <div class="project-img">
           <img src="img/project-placeholder-1.jpg" alt="Project 1">
       </div>
       <div class="project-info">
           <h3>Project Title</h3>
           <p>Project description...</p>
           <div class="project-links">
               <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Live</a>
               <a href="#" class="project-link"><i class="fab fa-github"></i> GitHub</a>
           </div>
       </div>
   </div>
   ```

## License

This template is free to use for personal and commercial projects. 