use XML::Simple qw(:strict);
use Data::Dumper;

$XML::Simple::PREFERRED_PARSER = 'XML::Parser';

my $filename = shift @ARGV;
my $xml = XML::Simple->new();
my $tree = $xml->XMLin($filename, ForceArray => 1, KeyAttr => {});

#my %hash = $tree->{participation}{person};

foreach my $player (@{$tree->{participation}{person}}) {
    print Dumper( $player );
}

#my $xmlfile = shift @ARGV;
#$parser = new XML::Parser(Style => 'Tree');
#my $tree = $parser->parsefile($xmlfile);
#
#use Data::Dumper;
#print Dumper( $tree['event'] );