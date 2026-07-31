import { PHOTO_CREDIT_NORMA, FEATURED_PHOTOS } from '../../data/photos'
import { PhotoGrid } from '../media/PhotoLightbox'
import './PhotoGallery.css'

export function ActionShots() {
  return (
    <section className="section photo-gallery-section">
      <div className="container">
        <h2>Action shots</h2>
        <p>
          By {PHOTO_CREDIT_NORMA} — Premier and Elite play, officials, and
          championship energy from past Freetail weekends.
        </p>
        <PhotoGrid photos={FEATURED_PHOTOS} leadFirst />
      </div>
    </section>
  )
}

/** @deprecated Use ActionShots */
export const FeaturedMoments = ActionShots
