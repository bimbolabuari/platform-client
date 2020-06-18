module.exports = AddLanguageDirective;

AddLanguageDirective.$inject = [];

function AddLanguageDirective() {
    return {
        restrict: 'E',
        controller: AddLanguageController,
        template: require('./add-language.html')
    };
}
AddLanguageController.$inject = ['$scope', 'ModalService','UtilsSdk', '_'];

function AddLanguageController($scope, ModalService, UtilsSdk, _) {
    $scope.selectLanguage = selectLanguage;
    $scope.selectedLanguage = '';
    $scope.add = add;
    $scope.cancel = cancel;

    function activate() {
        UtilsSdk.getLanguages().then(languageList => {
                $scope.languagesToSelect = _.filter(languageList.results, language => {
                    if ($scope.languagesToSelect && $scope.languagesToSelect.indexOf(language.code) > -1 && language.code !== $scope.languages.default) {
                        return language;
                    } else if (!$scope.languagesToSelect && language.code !== $scope.languages.default) {
                        return language;
                    }
                });
            });
    }
    activate();

    function selectLanguage(language) {
        if ($scope.enabledLanguages.available.indexOf(language) > -1 || $scope.enabledLanguages.default === language) {
            $scope.showLangError = true;
            $scope.langError = 'You cannot select this language since ';
            $scope.langError = $scope.enabledLanguages.default === language ?  `${$scope.langError} it is the default language for this survey.` : `${$scope.langError} there is already a translation for it.`;
        } else {
            $scope.showLangError = false;
            $scope.activeLanguage = language;

        }
    }

    function cancel() {
        ModalService.close();
    }

    function add() {
        if (!$scope.selectedLanguage) {
            $scope.langError = 'You need to select a language first';
            $scope.showLangError = true;
        }
        if (!$scope.showLangError) {
            $scope.switchToLanguage($scope.selectedLanguage);
            $scope.languages.available.push($scope.selectedLanguage);
            ModalService.close();
        }
    }
}
