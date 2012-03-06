$(function() {

    var services = {
        Production: {
            root: "www.flymine.org/query", 
            token: "21k3D5x5B8pdd8T9yeY24fG8th2",
            q: {
                select: ["symbol", "organism.name"], 
                from: "Gene", 
                where: {
                    Gene: {IN: "an awesome list"}, 
                    length: {lt: 5000}
                }
            }
        },
        Preview: {
          root: "preview.flymine.org/preview",
          token: "T1f3e5D8H9f0w7n1U3RaraXk9J8",
          q: {
              select: ["symbol", "proteins.name"], 
              from: "Gene", 
              where: {
                  length: {lt: 5000},
                  "chromosome.primaryIdentifier": "2L"
              }
          }
        },
        TestModel: {
          root: "risu.flymine.org/intermine-test",
          token: "test-user-token",
          q: {
              select: ["*", "age"],
              from: "Employee",
              where: [
                  ["age", "lt", 50 ],
                  ["age", "gt", 40 ]
              ]
          }
        },
        PlantMine: {
          root: "www.flymine.org/plantmine",
          q: {
              select: [
                        "primaryIdentifier",
                        "strainGenotypes.strain.name",
                        "strainGenotypes.strain.populations.name",
                        "chromosome.primaryIdentifier",
                        "chromosomeLocation.start",
                        "chromosomeLocation.end",
                        "alleles",
                        "strainGenotypes.allele1",
                        "strainGenotypes.allele2"
                      ],
              from: "SNP",
              where: {primaryIdentifier: "ENSVATH00002756"}
          }
        }
    };

    var login = function(serviceArgs) {
        var q = services[serviceArgs].q;
        var service = new intermine.Service(services[serviceArgs]);
        var qv = new intermine.results.QueryView(service, q);

        $('#table-display').empty();
        qv.$el.appendTo("#table-display");
        qv.render();

        $('.login-controls').toggleClass("logged-in", !!service.token);

        service.whoami(function(u) {
            $('#logged-in-notice').show().find('a.username').text(u.username);
        }).fail(function() {$('#logged-in-notice').hide()});
        service.fetchVersion(function(v) {
            $('.v9').toggleClass('unsupported', (v < 9));
        }).fail(function() {$('.v9').addClass('unsupported');});

    };

    $('.entry-points li').click(function() {
        login($(this).text());
        $('.entry-points li').removeClass("active");
        $(this).addClass("active");
    });

    login("Production");
    
});