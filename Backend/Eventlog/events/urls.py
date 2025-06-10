from django.urls import path
from .views import EventListCreateView, EventRetrieveUpdateDestroyView, MenuListCreateView, MenuRetrieveDestroyView, EventBudgetView, GuestListView, PollSettingsView, EventTitleView, GuestRetrieveDestroyView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='event-detail'),
    path('events/<int:event_id>/menu/', MenuListCreateView.as_view(), name='event-menu-list'),
    path('events/<int:event_id>/menu/<int:item_id>/', MenuRetrieveDestroyView.as_view(), name='event-menu-detail'),
    path('events/<int:event_id>/budget/', EventBudgetView.as_view(), name='event-budget'),
    path('events/<int:event_id>/poll/', PollSettingsView.as_view(), name='event-poll-settings'),
    path('events/<int:event_id>/guests/', GuestListView.as_view(), name='event-guests-list'),
    path('events/<int:event_id>/title/', EventTitleView.as_view(), name='event-title'),
    path('events/<int:event_id>/guests/exists/', GuestListView.as_view(), name='event-guests-list'),
    path('events/<int:event_id>/guests/<int:pk>/', GuestRetrieveDestroyView.as_view(), name='guest-detail'),
]
