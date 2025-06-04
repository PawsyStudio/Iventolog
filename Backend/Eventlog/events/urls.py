from django.urls import path
from .views import EventListCreateView, EventRetrieveUpdateDestroyView, MenuListCreateView, MenuRetrieveDestroyView, EventBudgetView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='event-detail'),
    path('events/<int:event_id>/menu/', MenuListCreateView.as_view(), name='event-menu-list'),
    path('events/<int:event_id>/menu/<int:item_id>/', MenuRetrieveDestroyView.as_view(), name='event-menu-detail'),
    path('events/<int:event_id>/budget/', EventBudgetView.as_view(), name='event-budget'),
]
