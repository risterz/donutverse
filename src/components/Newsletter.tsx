import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  );
  const [feedback, setFeedback] = useState('');
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();

    if (!cleaned) {
      setStatus('error');
      setFeedback('Please enter your email address before subscribing.');
      return;
    }

    if (!EMAIL_PATTERN.test(cleaned)) {
      setStatus('error');
      setFeedback('Please enter a valid email address (for example, name@domain.com).');
      return;
    }

    if (subscribedEmails.includes(cleaned)) {
      setStatus('error');
      setFeedback('This email is already on our sweet list.');
      return;
    }

    setStatus('submitting');
    setFeedback('');

    window.setTimeout(() => {
      setSubscribedEmails((prev) => [...prev, cleaned]);
      setStatus('success');
      setFeedback(
        'Welcome to the loop! Check your inbox soon for seasonal drops and exclusive treats.',
      );
      setEmail('');
    }, 450);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative bg-blush-100/75 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-strawberry-600 shadow-sm">
          <Mail className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2
          id="newsletter-heading"
          className="mt-5 font-display-soft text-4xl font-extrabold leading-tight tracking-tight text-cocoa-900 sm:text-5xl"
        >
          Stay in the <span className="italic text-strawberry-600">Loop.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cocoa-700 sm:text-lg">
          Get exclusive offers, new flavors, and sweet surprises delivered
          straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-9 max-w-xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error' || status === 'success') {
                  setStatus('idle');
                  setFeedback('');
                }
              }}
              placeholder="email@example.com"
              aria-invalid={status === 'error'}
              aria-describedby={feedback ? 'newsletter-feedback' : undefined}
              className="min-h-[54px] flex-1 rounded-full border border-cocoa-900/18 bg-cream-50 px-6 text-base text-cocoa-900 placeholder:text-cocoa-500/80 transition-colors focus:border-strawberry-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-cocoa-900 px-8 text-sm font-semibold text-cream-50 transition-colors hover:bg-strawberry-600 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {feedback && (
              <motion.p
                id="newsletter-feedback"
                role={status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium ${status === 'error'
                  ? 'bg-strawberry-600/12 text-strawberry-800'
                  : 'bg-cream-50 text-cocoa-900 shadow-sm'
                  }`}
              >
                {status === 'error' ? (
                  <AlertCircle className="h-4 w-4 shrink-0 text-strawberry-700" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-strawberry-600" aria-hidden="true" />
                )}
                <span>{feedback}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
