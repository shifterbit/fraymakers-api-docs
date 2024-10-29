{pkgs ? import <nixpkgs> {}}:
pkgs.mkShellNoCC {
  packages = with pkgs; [
    python312Packages.pip
    pipx
    mkdocs
    python312Packages.mkdocs-material
    (pkgs.python3.withPackages (python-pkgs:
      with python-pkgs; [
        # select Python packages here
        mkdocs
        mkdocs-material
      ]))
  ];
}
