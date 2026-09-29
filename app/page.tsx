import ReservationForm from "@/components/ReservationForm";
import OrderMenu from "../components/OrderMenu";

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <nav className="navbar container">
          <a className="logo" href="#home">
            <span>SAFFRON</span>
            <small>FINE DINING</small>
          </a>

          <div className="nav-links">
            <a href="#story">Our Story</a>
            <a href="#full-menu">Menu</a>
            <a href="#experience">Experience</a>
          </div>

          <a className="button button-small button-light" href="#reservation">
            Reserve a Table
          </a>
        </nav>

        <div className="hero-content container">
          <p className="eyebrow">Mediterranean Fine Dining · Amman</p>

          <h1>
            An evening
            <br />
            worth <em>remembering.</em>
          </h1>

          <p className="hero-description">
            Seasonal Mediterranean flavors, thoughtfully composed in the heart
            of Amman.
          </p>

          <div className="hero-actions">
            <a className="button button-gold" href="#reservation">
              Book Your Table <span>↗</span>
            </a>

            <a className="text-link" href="#full-menu">
              Explore the menu <span>↓</span>
            </a>
          </div>
        </div>

        <div className="hero-bottom container">
          <span>Open Tuesday — Sunday</span>
          <span>5:00 PM — 12:00 AM</span>
          <span>Abdali Boulevard, Amman</span>
        </div>
      </section>

      <section className="intro-section section container" id="story">
        <div className="intro-copy">
          <p className="eyebrow gold">The Saffron Philosophy</p>

          <h2>
            Every plate tells a story
            <br />
            of place, season, and soul.
          </h2>
        </div>

        <div className="intro-text">
          <p>
            Saffron is an intimate dining room where the Mediterranean meets
            modern imagination. We source with care, cook with precision, and
            welcome every guest like an old friend.
          </p>

          <a className="text-link dark-link" href="#experience">
            Discover the experience <span>→</span>
          </a>
        </div>
      </section>

      <section id="experience" className="experience-section">
        <div className="experience-top container">
          <div>
            <p className="eyebrow gold">AN EVENING AT SAFFRON</p>

            <h2>
              Designed for
              <br />
              unforgettable nights.
            </h2>
          </div>

          <p className="experience-intro">
            From your first cocktail to the final course, every detail is
            shaped around warmth, flavour, and effortless hospitality.
          </p>
        </div>

        <div className="experience-feature">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90"
            alt="Elegant Saffron dining experience"
          />

          <div className="experience-feature-copy">
            <p className="eyebrow gold">THE DINING ROOM</p>

            <h3>
              A table made
              <br />
              for staying awhile.
            </h3>

            <p>
              Seasonal menus, candlelit tables, and a relaxed rhythm that turns
              dinner into an occasion.
            </p>

            <a className="text-link light-link" href="#reservation">
              Reserve your evening <span>→</span>
            </a>
          </div>
        </div>

        <div className="experience-details container">
          <article>
            <span>01</span>
            <h3>Chef&apos;s Selection</h3>
            <p>
              A seasonal collection of dishes selected to take you through the
              Saffron kitchen.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>The Saffron Bar</h3>
            <p>
              Signature cocktails, rare spirits, and late-night conversation
              until midnight.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Private Occasions</h3>
            <p>
              Birthdays, intimate celebrations, and business dinners made
              personal.
            </p>
          </article>
        </div>
      </section>

    

      <OrderMenu />

      <section className="reservation-section" id="reservation">
        <div className="reservation-photo" />

        <div className="reservation-panel">
          <p className="eyebrow gold">Reserve Your Evening</p>
          <h2>Make a reservation</h2>

          <p className="reservation-description">
            Join us for a night of warm hospitality and unforgettable flavors.
          </p>

          <ReservationForm />
        </div>
      </section>

      <section className="visit-section section">
        <div className="container visit-layout">
          <div className="visit-image">
            <img
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85"
              alt="Saffron restaurant interior"
            />
          </div>

          <div className="visit-content">
            <p className="eyebrow">Visit Saffron</p>
            <h2>An evening worth staying for.</h2>

            <p className="visit-description">
              Join us for modern Mediterranean and Levantine cuisine,
              thoughtful service, and an atmosphere made for long
              conversations.
            </p>

            <div className="visit-details">
              <div>
                <span>Location</span>
                <p>Abdali Boulevard, Amman, Jordan</p>
              </div>

              <div>
                <span>Hours</span>
                <p>Tuesday — Sunday, 5 PM — 12 AM</p>
              </div>

              <div>
                <span>Contact</span>
                <a href="tel:0789854438">0789854438</a>
                <a href="mailto:saffron@gmail.com">saffron@gmail.com</a>
              </div>
            </div>

            <div className="visit-actions">
              <a
                className="button"
                href="https://www.google.com/maps/search/?api=1&query=Abdali+Boulevard+Amman"
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>

              <a
                className="instagram-link"
                href="https://www.instagram.com/SaffronAbdoun"
                target="_blank"
                rel="noreferrer"
              >
                @SaffronAbdoun
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-top">
          <div>
            <a className="logo footer-logo" href="#home">
              <span>SAFFRON</span>
              <small>FINE DINING</small>
            </a>

            <p>Seasonal Mediterranean dining in Amman.</p>
          </div>

          <div className="footer-links">
            <div>
              <span>Visit</span>
              <p>
                Abdali Boulevard
                <br />
                Amman, Jordan
              </p>
            </div>

            <div>
              <span>Contact</span>
              <p>
                0789854438
                <br />
                saffron@gmail.com
              </p>
            </div>

            <div>
              <span>Hours</span>
              <p>
                Tue — Sun
                <br />5 PM — 12 AM
              </p>
            </div>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 Saffron Restaurant</span>
          <span>Designed for memorable evenings</span>
        </div>
      </footer>
    </main>
  );
}