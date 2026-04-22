from rest_framework import serializers
from .models import Book, Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'slug']


class BookSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    genre = GenreSerializer(read_only=True)
    genre_id = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='genre',
        write_only=True
    )

    class Meta:
        model = Book
        fields = [
            'id',
            'owner',
            'title',
            'author',
            'isbn',
            'genre',
            'genre_id',
            'condition',
            'description',
            'image',
            'exchange_type',
            'is_available',
            'created_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at']