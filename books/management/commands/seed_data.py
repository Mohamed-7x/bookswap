"""
Seed demo data for development / portfolio screenshots.

Usage:
  python manage.py seed_data
"""

from __future__ import annotations

import random
from datetime import timedelta
from dataclasses import dataclass
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import IntegrityError, transaction
from django.utils import timezone

from books.models import Book, Genre
from exchanges.models import ExchangeRequest
from reviews.models import Review


User = get_user_model()


DEFAULT_PASSWORD = "test12345"


@dataclass(frozen=True)
class SeedUser:
    username: str
    email: str
    first_name: str
    last_name: str
    bio: str
    city: str


@dataclass(frozen=True)
class SeedBook:
    title: str
    author: str
    description: str
    condition: str  # must match Book.CONDITION_CHOICES values
    exchange_type: str  # must match Book.EXCHANGE_TYPE_CHOICES values


SEED_USERS: list[SeedUser] = [
    SeedUser(
        username="demo_reader_1",
        email="demo1@bookswap.dev",
        first_name="Amina",
        last_name="Khan",
        bio="Always looking for thoughtful nonfiction and books that help me level up my habits.",
        city="Austin",
    ),
    SeedUser(
        username="demo_reader_2",
        email="demo2@bookswap.dev",
        first_name="Noah",
        last_name="Martinez",
        bio="I swap books to stay curious. Clean code, practical systems, and a little philosophy.",
        city="Seattle",
    ),
    SeedUser(
        username="demo_reader_3",
        email="demo3@bookswap.dev",
        first_name="Sofia",
        last_name="Nguyen",
        bio="I love deep work sessions and books that turn complexity into clarity.",
        city="Toronto",
    ),
    SeedUser(
        username="demo_reader_4",
        email="demo4@bookswap.dev",
        first_name="Ethan",
        last_name="Brown",
        bio="I read to build. Refactoring and design patterns are always on the desk.",
        city="Denver",
    ),
    SeedUser(
        username="demo_reader_5",
        email="demo5@bookswap.dev",
        first_name="Maya",
        last_name="Patel",
        bio="Entrepreneurship books, product thinking, and the occasional sci-fi detour.",
        city="Boston",
    ),
]


SEED_BOOKS: list[SeedBook] = [
    SeedBook(
        title="Atomic Habits",
        author="James Clear",
        description="An accessible guide to building better habits through small, consistent improvements.",
        condition="like_new",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Clean Code",
        author="Robert C. Martin",
        description="A practical handbook for writing maintainable code and making software easier to evolve.",
        condition="good",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Deep Work",
        author="Cal Newport",
        description="How to focus without distraction and produce meaningful outcomes in a distracted world.",
        condition="good",
        exchange_type="exchange",
    ),
    SeedBook(
        title="The Pragmatic Programmer",
        author="Andrew Hunt & David Thomas",
        description="Timeless advice on craftsmanship, thinking, and building software that lasts.",
        condition="fair",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Zero to One",
        author="Peter Thiel",
        description="A framework for startups: how to move from uncertainty to unique value.",
        condition="new",
        exchange_type="donate",
    ),
    SeedBook(
        title="The Lean Startup",
        author="Eric Ries",
        description="Learn the build-measure-learn loop and how to validate ideas with minimal waste.",
        condition="like_new",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Design Patterns",
        author="Erich Gamma, Richard Helm, Ralph Johnson & John Vlissides",
        description="Classic patterns for solving recurring design problems in object-oriented systems.",
        condition="good",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Refactoring",
        author="Martin Fowler",
        description="Improve the design of existing code without changing its external behavior.",
        condition="good",
        exchange_type="exchange",
    ),
    SeedBook(
        title="You Don't Know JS",
        author="Kyle Simpson",
        description="A deep dive into JavaScript fundamentals across the language’s core concepts.",
        condition="fair",
        exchange_type="exchange",
    ),
    SeedBook(
        title="Introduction to Algorithms",
        author="Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein",
        description="A comprehensive introduction to algorithms and algorithmic thinking.",
        condition="worn",
        exchange_type="donate",
    ),
]


class Command(BaseCommand):
    help = "Seed demo users and books for development / portfolio screenshots (idempotent)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--users",
            type=int,
            default=5,
            help="Number of demo users to ensure exist (from the predefined list).",
        )

    def handle(self, *args, **options) -> None:
        try:
            books_created = 0

            users_to_ensure = int(options["users"])
            users_to_ensure = max(3, min(users_to_ensure, len(SEED_USERS)))

            seeded_users, users_created = self._seed_users(users_to_ensure)
            self.stdout.write(f"Ensured demo users: {len(seeded_users)}")

            books_created = self._seed_books(seeded_users)

            # Optional demo workflow data (best-effort; never blocks books).
            self._seed_exchanges_and_reviews(seeded_users)

            self.stdout.write(self.style.SUCCESS(f"Users created: {users_created}"))
            self.stdout.write(self.style.SUCCESS(f"Books created: {books_created}"))
        except Exception as exc:  # pragma: no cover
            self.stderr.write(self.style.ERROR(f"Seeding failed: {exc}"))

    def _seed_users(self, count: int) -> tuple[list[User], int]:
        created_count: int = 0
        ensured: list[User] = []

        for seed in SEED_USERS[:count]:
            try:
                user, created = User.objects.get_or_create(
                    username=seed.username,
                    defaults={
                        "email": seed.email,
                        "first_name": seed.first_name,
                        "last_name": seed.last_name,
                        "bio": seed.bio,
                        "city": seed.city,
                    },
                )
                if created:
                    user.set_password(DEFAULT_PASSWORD)
                    user.save(update_fields=["password"])
                    created_count += 1
                ensured.append(user)
            except IntegrityError:
                # Extremely defensive: if constraints change later, keep going.
                user = User.objects.get(username=seed.username)
                ensured.append(user)

        return ensured, created_count

    def _seed_books(self, users: list[User]) -> int:
        books_created = 0

        # Keep selection stable between runs.
        users_sorted = sorted(users, key=lambda u: u.username.lower())
        owners_cycle: list[User] = list(users_sorted)

        # Try to use an existing genre if the table exists; otherwise keep it null.
        genre_cache: list[Genre] = list(Genre.objects.all()[:5])

        rng = random.Random(42)
        now = timezone.now()
        created_window_days = 45

        for i, seed_book in enumerate(SEED_BOOKS):
            owner = owners_cycle[i % len(owners_cycle)]
            if Book.objects.filter(owner=owner, title=seed_book.title).exists():
                continue

            # Randomize created_at (optional requirement). Only applies on creation.
            created_at = now - timedelta(days=rng.randint(0, created_window_days))

            # Pick a genre when available (keeps seeded content realistic but optional).
            genre = rng.choice(genre_cache) if genre_cache else None

            try:
                with transaction.atomic():
                    Book.objects.create(
                        owner=owner,
                        title=seed_book.title,
                        author=seed_book.author,
                        description=seed_book.description,
                        condition=seed_book.condition,
                        exchange_type=seed_book.exchange_type,
                        is_available=True,
                        genre=genre,
                        # Only effective when field is not already set by auto_now_add.
                        created_at=created_at,
                    )
                books_created += 1
            except IntegrityError as exc:
                self.stderr.write(self.style.WARNING(f"Skipping book '{seed_book.title}' ({exc})"))
            except Exception as exc:
                self.stderr.write(self.style.WARNING(f"Skipping book '{seed_book.title}' ({exc})"))

        return books_created

    def _seed_exchanges_and_reviews(self, users: list[User]) -> None:
        """
        Best-effort optional demo data:
        - 2–3 exchange requests
        - 2–3 reviews
        """

        try:
            users_sorted = sorted(users, key=lambda u: u.username.lower())
            if len(users_sorted) < 2:
                return

            rng = random.Random(123)
            books = list(Book.objects.filter(owner__in=users_sorted, is_available=True))
            if len(books) < 4:
                return

            # Build candidate pairs (offered/requested from different owners).
            def distinct_owner_pair(b1: Book, b2: Book) -> bool:
                return b1.owner_id != b2.owner_id and b1.id != b2.id

            created_exchanges = 0
            desired_exchanges = min(3, len(users_sorted) - 1)

            for _ in range(50):  # keep searching until we create enough
                if created_exchanges >= desired_exchanges:
                    break

                offered = rng.choice(books)
                requested = rng.choice(books)
                if not distinct_owner_pair(offered, requested):
                    continue

                sender = offered.owner
                receiver = requested.owner

                # Avoid duplicate exchange requests.
                exists = ExchangeRequest.objects.filter(
                    sender=sender,
                    receiver=receiver,
                    offered_book=offered,
                    requested_book=requested,
                ).exists()
                if exists:
                    continue

                try:
                    ExchangeRequest.objects.create(
                        sender=sender,
                        receiver=receiver,
                        offered_book=offered,
                        requested_book=requested,
                        message="Hi! I'd love to swap these books. Let's make it happen!",
                        status="pending",
                    )
                    created_exchanges += 1
                except Exception as exc:
                    self.stderr.write(self.style.WARNING(f"Could not create exchange: {exc}"))

            # Reviews (2–3) for the created or existing exchanges.
            exchanges = list(ExchangeRequest.objects.filter(status="pending", sender__in=users_sorted).order_by("-id")[:5])
            if len(exchanges) < 2:
                return

            desired_reviews = min(3, len(exchanges))
            created_reviews = 0

            for ex in exchanges:
                if created_reviews >= desired_reviews:
                    break

                reviewer = ex.receiver  # reviewer is the person being reviewed after the exchange completes; demo only
                if reviewer_id := getattr(reviewer, "id", None):
                    # UniqueConstraint: (reviewer, exchange)
                    if Review.objects.filter(reviewer=reviewer, exchange=ex).exists():
                        continue
                else:
                    continue

                try:
                    Review.objects.create(
                        reviewer=reviewer,
                        reviewed_user=ex.sender,
                        exchange=ex,
                        rating=rng.randint(4, 5),
                        comment="Great exchange! The book was exactly as described and communication was excellent.",
                    )
                    created_reviews += 1
                except IntegrityError:
                    # Unique constraint / race: ignore
                    continue
                except Exception as exc:
                    self.stderr.write(self.style.WARNING(f"Could not create review: {exc}"))

        except Exception as exc:  # pragma: no cover
            self.stderr.write(self.style.WARNING(f"Skipping optional exchange/review seeding: {exc}"))

