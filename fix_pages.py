import os

BASE = "/Users/thtesche/VibeCoding/ashtanga_yoga_zentral_astro/src/pages/"

about_content = """---
title: About Elinore Burke
---
import MainLayout from '../layouts/MainLayout.astro';

<MainLayout title="About Elinore Burke">

<div class="page-header">
  <div class="container text-center animate-fade-in">
    <h1>Elinore Burke</h1>
    <p class="subtitle">Authorized-Level 2 Ashtanga Yoga Teacher & Yoga Therapist</p>
  </div>
</div>

<section class="section">
  <div class="container animate-fade-in-delay">
    <div class="surface about-content">
      <div class="content-block">
        <img src={import.meta.env.BASE_URL + "images/img_0_elinore_burke_with_dogs-300x225.jpg"} alt="Elinore Burke with dogs" class="about-image" />
        <p><strong>Elinore has practiced yoga since 1996 and taught since 2004.</strong> She began her journey with the Bihar School of Yoga in Northern India and explored Vipassana meditation through extended silent retreats. In New York, she discovered Ashtanga Yoga with Eddie Stern and was captivated by its meditative flow. It has been her daily practice since 2001.</p>
        <p>She is a Level 2 Authorized teacher by KPJAYI/SYC in Mysore, India. Her studies began there in 2004 with the late Sri K. Pattabhi Jois and continued for many years with his grandson, Sharath Jois. She also holds a Yoga Therapy qualification from Yogacampus in London (2016) and completed a Mindfulness Meditation Teacher Training with Christopher Titmuss (2018).</p>
        <p>For Elinore, yoga is a way to connect more deeply with the unfolding of life. She teaches traditional Ashtanga Yoga as it was transmitted to her over many years of study in Mysore. Rooted in yoga therapy and meditation, her classes invite students into a process of self-discovery that nurtures awareness and inner strength.</p>
      </div>
    </div>
  </div>
</section>

<section class="section bg-light testimonials-section">
  <div class="container">
    <h2 class="text-center text-secondary mb-4">Testimonials</h2>
    <div class="testimonials-grid">
      <div class="surface testimonial-card">
        <p>"Good teachers know how to teach. Great teachers are holding a space for their students to learn. Elinore's way of sharing her knowledge and experience of the practice is always precise, calm and encouraging."</p>
        <div class="author">&mdash; Julia, Berlin</div>
      </div>
      <div class="surface testimonial-card">
        <p>"Elinore introduced me to self practice, the reason I fell in love with Ashtanga. Although we no longer live in the same city, I attend her classes whenever I get the opportunity. She is a serious and disciplined teacher, but also one with warmth, tenderness and understanding."</p>
        <div class="author">&mdash; Sean, London</div>
      </div>
      <div class="surface testimonial-card">
        <p>"I met Elinore at the beginning of my Ashtanga journey. Her deep knowledge of yoga, trust in the practice and her relaxed nature helped me tremendously to gain confidence and settle into my own practice. In the Mysore room she creates an atmosphere where everyone feels seen and well cared for."</p>
        <div class="author">&mdash; Thorben, Göttingen</div>
      </div>
      <div class="surface testimonial-card">
        <p>"Elinore was my yoga teacher for 6 years in Berlin. She was very attentive and I loved her precise instructions and the way she would gently push me deeper into the pose. After each session I felt very balanced and grateful. I learned to trust her completely and loved her attentive, heart-warming manner."</p>
        <div class="author">&mdash; Claudia, Berlin</div>
      </div>
      <div class="surface testimonial-card">
        <p>"I am very grateful for the practice with Elinore, and wish I would have had more time to learn from her. I have seen her teaching absolute beginners and advanced practitioners alike with the same patient manner. With her many years of experience, deep understanding of the practice and kind soul, she is an absolute inspiration of a yoga teacher."</p>
        <div class="author">&mdash; Hanna, Australia</div>
      </div>
      <div class="surface testimonial-card">
        <p>"Elinore's knowledge of and enthusiasm for Ashtanga yoga is both astounding and inspiring. She practices and teaches with such sincere conviction that it encourages the student to share her immense enthusiasm. Her friendly, easy-going nature makes you feel comfortable from the first class, whatever your ability. You will leave her class feeling you have had expert guidance and made a great friend."</p>
        <div class="author">&mdash; Johanna, London</div>
      </div>
    </div>
  </div>
</section>

</MainLayout>

<style>
.page-header{background-color:var(--color-primary);color:#fff;padding:6rem 0 4rem}
.page-header h1{color:#fff;margin-bottom:.5rem}
.subtitle{font-family:var(--font-heading);font-size:1.25rem;color:#ffffffe6}
.text-center{text-align:center}
.text-secondary{color:var(--color-secondary)}
.bg-light{background-color:#f8f5f0}
.mb-4{margin-bottom:4rem}
.about-content{max-width:800px;margin:-4rem auto 0;position:relative;z-index:10}
.about-image{float:right;margin:0 0 1.5rem 2rem;border-radius:8px;box-shadow:var(--shadow-sm)}
.content-block p{font-size:1.15rem;line-height:1.8}
.content-block p:last-child{margin-bottom:0}
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem}
.testimonial-card{display:flex;flex-direction:column;height:100%}
.testimonial-card p{font-style:italic;flex-grow:1;color:#4a5550}
.author{font-family:var(--font-heading);font-weight:500;color:var(--color-primary);text-align:right;margin-top:1.5rem}
</style>
"""

with open(BASE + "about.mdx", "w") as f:
    f.write(about_content)

contact_content = """---
title: Contact
---
import MainLayout from '../layouts/MainLayout.astro';

<MainLayout title="Contact Elinore Burke">

<div class="page-header">
  <div class="container text-center animate-fade-in">
    <h1>Contact</h1>
    <p class="subtitle">Let's keep in touch!</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="contact-wrapper">
      <div class="contact-info surface animate-fade-in-delay">
        <h2 class="text-primary">Get in Touch</h2>
        <p>Send a message for more info or to sign up for my newsletter!</p>
        <div class="info-block mt-4">
          <h3>Location</h3>
          <p><strong>Three Boons Studio</strong><br/>Brunnen Str. 29/3 (Hinterhof)<br/>10119 Berlin</p>
        </div>
        <div class="info-block">
          <h3>Studio Information</h3>
          <p>If you're new to yoga, please allow around 30 minutes for your first class. Beginners are always welcome.</p>
        </div>
      </div>
      <div class="contact-form surface animate-fade-in-delay">
        <form id="contact-form" action="#" method="POST">
          <div class="form-row">
            <div class="form-group">
              <label for="first-name">First Name (required)</label>
              <input type="text" id="first-name" name="first-name" required />
            </div>
            <div class="form-group">
              <label for="last-name">Last Name (required)</label>
              <input type="text" id="last-name" name="last-name" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email (required)</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6"></textarea>
          </div>
          <button type="submit" class="btn btn-submit">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

</MainLayout>

<script>
  const t=document.getElementById("contact-form");
  if(t){
    t.addEventListener("submit",n=>{
      n.preventDefault();
      const e=t.querySelector("button");
      if(e){
        e.textContent="Message Sent!";
        e.style.backgroundColor="#637B69";
        setTimeout(()=>{
          e.textContent="Send Message";
          t.reset();
        },3e3);
      }
    });
  }
</script>

<style>
.page-header{background-color:var(--color-primary);color:#fff;padding:6rem 0 4rem}
.page-header h1{color:#fff;margin-bottom:.5rem}
.subtitle{font-family:var(--font-heading);font-size:1.25rem;color:#ffffffe6}
.text-center{text-align:center}
.text-primary{color:var(--color-primary)}
.mt-4{margin-top:2rem}
.contact-wrapper{display:grid;grid-template-columns:1fr 1.5fr;gap:3rem;max-width:1000px;margin:-4rem auto 0;position:relative;z-index:10}
.info-block{margin-top:2rem;padding-top:2rem;border-top:1px solid var(--color-border)}
.info-block h3{font-size:1.25rem;color:var(--color-secondary);margin-bottom:.5rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.form-group{margin-bottom:.5rem}
.btn-submit{width:100%;margin-top:1rem;font-size:1.1rem}
@media (max-width: 768px){.contact-wrapper{grid-template-columns:1fr;margin-top:0}.form-row{grid-template-columns:1fr;gap:0}}
</style>
"""

with open(BASE + "contact.mdx", "w") as f:
    f.write(contact_content)

moon_content = """---
title: Moon Days 2026
---
import MainLayout from '../layouts/MainLayout.astro';

<MainLayout title="Moon Days 2026">

<div class="page-header">
  <div class="container text-center animate-fade-in">
    <h1>Moon Days 2026</h1>
    <p class="subtitle">Moon Days offer a break to realign with the rhythms of nature.</p>
  </div>
</div>

<section class="section">
  <div class="container animate-fade-in-delay">
    <div class="surface moon-content text-center mb-4">
      <p class="large-text">The shala is closed on these days...</p>
      <div class="moon-legend">
        <span class="legend-item"><span class="moon-icon full">&#9679;</span> Full Moon</span>
        <span class="legend-item"><span class="moon-icon new">&#9675;</span> New Moon</span>
      </div>
    </div>
    
    <div class="calendar-grid">
      <div class="surface month-card">
        <h3>January</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Sat 3</li>
          <li><span class="moon-icon new">&#9675;</span> Sun 18</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>February</h3>
        <ul class="moon-list">
          <li><span class="moon-icon new">&#9675;</span> Sun 1</li>
          <li><span class="moon-icon full">&#9679;</span> Tues 17</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>March</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Tue 3</li>
          <li><span class="moon-icon new">&#9675;</span> Thu 19</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>April</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Thu 2</li>
          <li><span class="moon-icon new">&#9675;</span> Fri 17</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>May</h3>
        <ul class="moon-list">
          <li><span class="moon-icon new">&#9675;</span> Fri 1</li>
          <li><span class="moon-icon full">&#9679;</span> Sun 17</li>
          <li><span class="moon-icon new">&#9675;</span> Sun 31</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>June</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Mon 15</li>
          <li><span class="moon-icon new">&#9675;</span> Mon 29</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>July</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Tue 14</li>
          <li><span class="moon-icon new">&#9675;</span> Wed 29</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>August</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Wed 12</li>
          <li><span class="moon-icon new">&#9675;</span> Fri 28</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>September</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Fri 11</li>
          <li><span class="moon-icon new">&#9675;</span> Sat 26</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>October</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Sat 10</li>
          <li><span class="moon-icon new">&#9675;</span> Mon 26</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>November</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Mon 9</li>
          <li><span class="moon-icon new">&#9675;</span> Tue 24</li>
        </ul>
      </div>
      <div class="surface month-card">
        <h3>December</h3>
        <ul class="moon-list">
          <li><span class="moon-icon full">&#9679;</span> Wed 9</li>
          <li><span class="moon-icon new">&#9675;</span> Thu 24</li>
        </ul>
      </div>
    </div>
  </div>
</section>

</MainLayout>

<style>
.page-header{background-color:var(--color-primary);color:#fff;padding:6rem 0 4rem}
.page-header h1{color:#fff;margin-bottom:.5rem}
.subtitle{font-family:var(--font-heading);font-size:1.25rem;color:#ffffffe6}
.text-center{text-align:center}
.mb-4{margin-bottom:3rem}
.large-text{font-size:1.25rem;color:var(--color-primary);font-weight:500}
.moon-content{max-width:600px;margin:-3rem auto 3rem;position:relative;z-index:10;padding:2rem!important}
.moon-legend{display:flex;justify-content:center;gap:2rem;margin-top:1rem;font-family:var(--font-heading)}
.legend-item{display:flex;align-items:center;gap:.5rem}
.moon-icon{font-size:1.2rem}
.moon-icon.full{color:#333}
.moon-icon.new{color:var(--color-secondary)}
.calendar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:2rem}
.month-card{text-align:center;padding:2rem}
.month-card h3{color:var(--color-secondary);border-bottom:1px solid var(--color-border);padding-bottom:1rem;margin-bottom:1.5rem}
.moon-list{list-style:none;padding:0}
.moon-list li{display:flex;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1rem;font-size:1.1rem}
@media (max-width: 768px){.calendar-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem}}
</style>
"""

with open(BASE + "moon-days.mdx", "w") as f:
    f.write(moon_content)

retreats_content = """---
title: Retreats & Events
---
import MainLayout from '../layouts/MainLayout.astro';

<MainLayout title="Retreats & Events">

<div class="page-header">
  <div class="container text-center animate-fade-in">
    <h1>Retreats & Events</h1>
    <p class="subtitle">Yoga & Meditation Retreats</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <h2 class="text-secondary text-center mb-4">Upcoming Retreats</h2>
    
    <div class="retreat-card surface animate-fade-in-delay">
      <div class="retreat-date">25 &ndash; 28 June 2026</div>
      <div class="retreat-content">
        <img src={import.meta.env.BASE_URL + "images/img_1_elinore_retreat_mecklenburg.jpg"} alt="Mecklenburg Retreat" class="retreat-img" />
        <h3>Ashtanga Yoga Long Weekend in Mecklenburg</h3>
        <p class="text-muted mb-2">(arrive Thursday late afternoon &ndash; depart Sunday after Lunch)</p>
        <p>This weekend retreat offers us a special opportunity to come together and delve deeply into ideas that enrich our practice, complemented by chanting, breath work, and meditation. There will be morning Mysore sessions and workshops tailored to your interests.</p>
        <p>We'll have plenty of time to connect in a relaxed setting while our host, Juli, whips up her delish vegetarian/vegan eats. The converted farm building has comfy beds, plenty of space and a wood-burning sauna. A walk through the woods leads us to the Tollense Lake for a swim.</p>
        <div class="retreat-footer">
          <span class="price">Cost: &euro;415</span>
          <a href={import.meta.env.BASE_URL + "contact"} class="btn">Questions / Booking</a>
        </div>
      </div>
    </div>
    
    <div class="retreat-card surface mt-4">
      <div class="retreat-date">1 August &ndash; 7 August 2026</div>
      <div class="retreat-content">
        <img src={import.meta.env.BASE_URL + "images/img_2_yogaPulia_retreat_centre_images.jpg"} alt="Yoga Puglia Retreat" class="retreat-img" />
        <h3>Ashtanga Yoga Retreat &ndash; Puglia, Italy</h3>
        <p>Join me at YogApulia, a boutique retreat center in the gorgeous Puglia region of Southern Italy.</p>
        <p>There will be guided-self practice Ashtanga Yoga (Mysore-style), pranayama, chanting, and seated/walking meditation, plus workshops & evening classes shaped by the group. This retreat is open to all levels, with space for just 12 participants to ensure personalized support.</p>
        <p>Delicious plant-based meals are inspired by local traditions and designed to nourish and sustain your practice. When you're not on the mat, you can relax by the pool or explore olive groves, beaches, markets, and nearby towns.</p>
        <div class="retreat-footer">
          <div class="price-stack">
            <span>Shared double room: &euro;995</span>
            <span>Single room: &euro;1325</span>
          </div>
          <a href="https://www.yogapulia.com/elinore-burke-2026" target="_blank" rel="noopener noreferrer" class="btn btn-outline">More Details</a>
          <a href={import.meta.env.BASE_URL + "contact"} class="btn">Questions / Booking</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section bg-light">
  <div class="container">
    <h2 class="text-center mb-4">Past Events</h2>
    <div class="grid-2-col">
      <div class="surface">
        <h3>LARUGA returns to Berlin</h3>
        <p class="text-muted">22&ndash;28 Sept 2025</p>
        <p>I'm delighted to welcome Laruga Glaser back to Berlin for the fourth time &mdash; a rare opportunity to deepen your practice with one of Ashtanga's most experienced teachers.</p>
        <ul class="event-details">
          <li>Mysore Practice Week</li>
          <li>Weekend Workshop</li>
          <li>Location: SPREEFELD</li>
        </ul>
      </div>
      <div class="surface">
        <h3>Weekend Workshop with Laruga</h3>
        <p class="text-muted">27&ndash;29 Sept 2024</p>
        <p>Hosted Laruga for the 3rd time in Berlin! Included led classes, mysore practice, and special workshops.</p>
      </div>
    </div>
  </div>
</section>

</MainLayout>

<style>
.page-header{background-color:var(--color-primary);color:#fff;padding:6rem 0 4rem}
.page-header h1{color:#fff;margin-bottom:.5rem}
.subtitle{font-family:var(--font-heading);font-size:1.25rem;color:#ffffffe6}
.text-center{text-align:center}
.text-secondary{color:var(--color-secondary)}
.text-muted{color:#777}
.bg-light{background-color:#f8f5f0}
.mb-2{margin-bottom:1rem}
.mb-4{margin-bottom:3rem}
.mt-4{margin-top:3rem}
.retreat-card{display:flex;padding:0;overflow:hidden}
.retreat-date{background-color:var(--color-secondary);color:#fff;padding:2.5rem 1.5rem;min-width:250px;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:1.5rem;font-weight:500;text-align:center}
.retreat-img{width:100%;max-height:400px;object-fit:cover;border-radius:8px;margin-bottom:1.5rem}
.retreat-content{padding:2.5rem;flex-grow:1}
.retreat-footer{display:flex;align-items:center;gap:1.5rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--color-border);flex-wrap:wrap}
.price{font-family:var(--font-heading);font-weight:600;font-size:1.25rem;color:var(--color-primary);margin-right:auto}
.price-stack{display:flex;flex-direction:column;margin-right:auto;font-family:var(--font-heading);color:var(--color-primary);font-weight:500}
.grid-2-col{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.event-details{margin-top:1.5rem;padding-left:1.5rem;color:#4a5550}
.event-details li{margin-bottom:.5rem}
@media (max-width: 768px){.retreat-card{flex-direction:column}.retreat-date{min-width:100%;padding:1.5rem;font-size:1.25rem}.grid-2-col{grid-template-columns:1fr}.retreat-footer{flex-direction:column;align-items:flex-start}.price{margin-bottom:1rem}}
</style>
"""

with open(BASE + "retreats.mdx", "w") as f:
    f.write(retreats_content)

print("Done")
