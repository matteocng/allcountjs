var EntityViewController = ['$scope', 'track', '$window', '$location', function ($scope, track, $window, $location) {
    $scope.viewState = {
        mode: 'list',
        filtering: {}
    };

    track('allcount-entity-load', {
        location: $window.location.href
    });

    $scope.returnToGrid = function () {
        track('allcount-entity-return-to-grid', {
            location: $window.location.href
        });
        $scope.viewState.mode = 'list';
        $scope.viewState.isFormEditing = false;
        $scope.pagingMethods.refresh();
        $scope.gridMethods.updateGrid();
    };

    $scope.navigateTo = function (entityId) {
        track('allcount-entity-navigate-to', {
            location: $window.location.href,
            entityId: entityId
        });
        $scope.viewState.formEntityId = entityId;
        $scope.viewState.mode = 'form';
    };

    $scope.startEditing = function () {
        track('allcount-entity-start-editing', {
            location: $window.location.href
        });
        $scope.editForm.reloadEntity(function () {
            $scope.viewState.isFormEditing = true;
        });
    };

    $scope.doneEditing = function () {
        track('allcount-entity-done-editing', {
            location: $window.location.href
        });
        $scope.editForm.updateEntity(function () {
            $scope.viewState.isFormEditing = false;
            $scope.editForm.reloadEntity();
            $scope.actionMethods.refresh();
        });
    };

    $scope.deleteEntity = function () {
        track('allcount-entity-delete', {
            location: $window.location.href
        });
        $scope.editForm.deleteEntity(function () {
            $scope.viewState.mode = 'list';
            $scope.viewState.isFormEditing = false;
            $scope.pagingMethods.refresh();
            $scope.gridMethods.updateGrid();
        });
    };

    $scope.startGridEditing = function() {
        track('allcount-entity-start-grid-editing', {
            location: $window.location.href
        });
        $scope.viewState.editState = true;
    };

    $scope.doneGridEditing = function() {
        track('allcount-entity-done-grid-editing', {
            location: $window.location.href
        });
        $scope.viewState.editState = false;
        setTimeout(function () {
            $scope.$evalAsync(function () {
                $scope.pagingMethods.refresh();
                $scope.gridMethods.updateGrid();
                $scope.actionMethods.refresh();
            });
        }, 400); //TODO delay for animation hack
    };

    $scope.toCreate = function () {
        track('allcount-entity-create', {
            location: $window.location.href
        });
        $scope.viewState.mode = 'create';
        $scope.createForm.reloadEntity();
    };

    $scope.refreshOnAction = function () {
        $scope.pagingMethods.refresh();
        $scope.gridMethods.updateGrid();
        $scope.editForm.reloadEntity();
    };

    $scope.showList = function () {
        return $scope.viewState.mode === "list" && $scope.viewState.paging && $scope.viewState.paging.count > 0 || $scope.viewState.editState;
    };

    $scope.updateStateFromLocation = function () {
        var splitPath = _.filter(($location.path() || '').split('/'), _.identity);
        if (splitPath.length === 1 && splitPath[0]) {
            if (splitPath[0] === 'new') {
                $scope.viewState.mode = 'create';
            } else {
                $scope.viewState.formEntityId = splitPath[0];
                $scope.viewState.mode = 'form';
            }
            $scope.viewState.isFormEditing = false;
        } else if (splitPath.length === 2) {
            $scope.viewState.formEntityId = splitPath[0];
            $scope.viewState.mode = 'form';
            $scope.viewState.isFormEditing = true;
        } else {
            $scope.viewState.mode = 'list';
            $scope.viewState.isFormEditing = false;
        }
    };

    $scope.updateLocationFromState = function () {
        if ($scope.viewState.mode === 'form') {
            $location.path($scope.viewState.formEntityId + ($scope.viewState.isFormEditing ? '/edit' : ''));
        } else if ($scope.viewState.mode === 'create') {
            $location.path('new')
        } else {
            $location.path(null);
        }
    };

    $scope.$on('$locationChangeStart', $scope.updateStateFromLocation);
    $scope.$watch('viewState.mode', $scope.updateLocationFromState);
    $scope.$watch('viewState.formEntityId', $scope.updateLocationFromState);
    $scope.$watch('viewState.isFormEditing', $scope.updateLocationFromState);

    $scope.updateStateFromLocation();
}];

allcountModule.controller('EntityViewController', EntityViewController);