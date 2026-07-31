import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { TournamentPhoto } from '../../data/photos'
import '../home/PhotoGallery.css'
import './PhotoLightbox.css'

interface PhotoViewerState {
  photos: TournamentPhoto[]
  index: number
}

interface PhotoViewerContextValue {
  open: (photos: TournamentPhoto[], index: number) => void
  close: () => void
}

const PhotoViewerContext = createContext<PhotoViewerContextValue | null>(null)

export function usePhotoViewer() {
  const ctx = useContext(PhotoViewerContext)
  if (!ctx) {
    throw new Error('usePhotoViewer must be used within PhotoViewerProvider')
  }
  return ctx
}

export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const [viewer, setViewer] = useState<PhotoViewerState | null>(null)
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const open = useCallback((photos: TournamentPhoto[], index: number) => {
    if (!photos.length) return
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setViewer({
      photos,
      index: Math.max(0, Math.min(index, photos.length - 1)),
    })
  }, [])

  const close = useCallback(() => {
    setViewer(null)
    const restore = restoreFocusRef.current
    restoreFocusRef.current = null
    // Defer so dialog unmounts before focus returns
    requestAnimationFrame(() => restore?.focus())
  }, [])

  const go = useCallback((delta: number) => {
    setViewer((prev) => {
      if (!prev || prev.photos.length < 2) return prev
      const next =
        (prev.index + delta + prev.photos.length) % prev.photos.length
      return { ...prev, index: next }
    })
  }, [])

  useEffect(() => {
    if (!viewer) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    // Initial focus on close control
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [viewer, close, go])

  const value = useMemo(() => ({ open, close }), [open, close])
  const current = viewer ? viewer.photos[viewer.index] : null

  return (
    <PhotoViewerContext.Provider value={value}>
      {children}
      {viewer && current ? (
        <div
          ref={dialogRef}
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="photo-lightbox__backdrop"
            aria-label="Close photo"
            onClick={close}
          />
          <div className="photo-lightbox__panel">
            <button
              ref={closeRef}
              type="button"
              className="photo-lightbox__close"
              onClick={close}
              aria-label="Close"
            >
              ×
            </button>
            {viewer.photos.length > 1 ? (
              <>
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--prev"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--next"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            ) : null}
            <img
              src={current.src}
              alt={current.alt}
              className="photo-lightbox__img"
            />
            <div className="photo-lightbox__meta" id={titleId}>
              <p>{current.caption ?? current.alt}</p>
              {current.credit ? (
                <p className="photo-lightbox__credit">{current.credit}</p>
              ) : null}
              {viewer.photos.length > 1 ? (
                <p className="photo-lightbox__count">
                  {viewer.index + 1} / {viewer.photos.length}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PhotoViewerContext.Provider>
  )
}

interface ClickablePhotoProps {
  photo: TournamentPhoto
  photos: TournamentPhoto[]
  index: number
  className?: string
  imgClassName?: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
  sizes?: string
}

export function ClickablePhoto({
  photo,
  photos,
  index,
  className,
  imgClassName,
  width,
  height,
  loading = 'lazy',
  sizes,
}: ClickablePhotoProps) {
  const { open } = usePhotoViewer()
  return (
    <button
      type="button"
      className={['clickable-photo', className].filter(Boolean).join(' ')}
      onClick={() => open(photos, index)}
      aria-label={`View larger: ${photo.alt}`}
    >
      <img
        className={imgClassName}
        src={photo.src}
        alt={photo.alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        sizes={sizes}
      />
    </button>
  )
}

interface PagePhotoBandProps {
  photo: TournamentPhoto
  /** Extra photos available when the banner is opened in the lightbox */
  gallery?: readonly TournamentPhoto[]
  label?: string
}

export function PagePhotoBand({
  photo,
  gallery,
  label = 'From the pitch',
}: PagePhotoBandProps) {
  const list = gallery?.length ? [...gallery] : [photo]
  const index = Math.max(
    0,
    list.findIndex((p) => p.src === photo.src),
  )
  return (
    <section className="page-photo-banner" aria-label={label}>
      <figure className="page-photo-banner__figure">
        <ClickablePhoto
          photo={photo}
          photos={list}
          index={index === -1 ? 0 : index}
          width={1400}
          height={700}
          loading="eager"
          sizes="100vw"
        />
        {photo.caption ? (
          <figcaption className="page-photo-banner__caption">
            {photo.caption}
          </figcaption>
        ) : null}
      </figure>
    </section>
  )
}

interface PhotoGridProps {
  photos: readonly TournamentPhoto[]
  leadFirst?: boolean
  className?: string
}

export function PhotoGrid({
  photos,
  leadFirst = false,
  className,
}: PhotoGridProps) {
  const list = [...photos]
  return (
    <ul className={['photo-gallery', className].filter(Boolean).join(' ')}>
      {list.map((photo, index) => (
        <li
          key={photo.src}
          className={[
            'photo-gallery__item',
            leadFirst && index === 0 ? 'photo-gallery__item--lead' : '',
            photo.caption ? 'photo-gallery__item--captioned' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <figure>
            <div className="photo-gallery__frame">
              <ClickablePhoto
                photo={photo}
                photos={list}
                index={index}
                width={800}
                height={800}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </div>
            {photo.caption ? (
              <figcaption className="photo-gallery__caption">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  )
}
